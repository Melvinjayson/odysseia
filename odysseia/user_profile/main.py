import os
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from neo4j import Session

from graph import (
    close_driver,
    enforce_visibility,
    forbid_without_consent,
    generate_id,
    get_session,
    knowledge_record_to_dict,
    metric_record_to_dict,
    opportunity_record_to_dict,
    scrub_contact,
    user_record_to_dict,
)
from models import (
    HealthResponse,
    Knowledge,
    KnowledgeCreate,
    MatchRequest,
    MatchResult,
    MemoryRequest,
    Metric,
    MetricCreate,
    Opportunity,
    OpportunityCreate,
    UserProfile,
    UserProfileCreate,
)


@asynccontextmanager
def lifespan(app: FastAPI):
    yield
    close_driver()


authenticated_domains = set(
    os.getenv("TRUSTED_EMAIL_DOMAINS", "").split(",") if os.getenv("TRUSTED_EMAIL_DOMAINS") else []
)

app = FastAPI(lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


def _authorize_user(record_data: dict, viewer_id: Optional[str], include_private: bool):
    try:
        enforce_visibility(record_data, viewer_id, include_private)
        forbid_without_consent(record_data, viewer_id, include_private)
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))

    scrub_contact(record_data, record_data.get("id"), viewer_id)


def _run_user_query(session: Session, user_id: str) -> Optional[dict]:
    query = """
    MATCH (u:User {id: $id})
    WHERE coalesce(u.deleted, false) = false
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    RETURN u, collect(distinct s.name) as skills
    """
    record = session.run(query, id=user_id).single()
    if not record:
        return None
    return user_record_to_dict(record)


def _list_users(session: Session, viewer_id: Optional[str], include_private: bool) -> List[dict]:
    query = """
    MATCH (u:User)
    WHERE coalesce(u.deleted, false) = false
    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
    RETURN u, collect(distinct s.name) as skills
    """
    results = []
    for record in session.run(query):
        data = user_record_to_dict(record)
        try:
            _authorize_user(data, viewer_id, include_private)
        except HTTPException:
            continue
        results.append(data)
    return results


def _persist_user(session: Session, user: UserProfileCreate) -> dict:
    user_id = generate_id(user.id)
    query = """
    MERGE (u:User {id: $id})
    SET u.name=$name,
        u.email=$email,
        u.bio=$bio,
        u.visibility=$visibility,
        u.consent_to_share=$consent,
        u.allow_contact=$allow_contact,
        u.created_at=coalesce(u.created_at, datetime()),
        u.deleted=false
    WITH u
    OPTIONAL MATCH (u)-[old:HAS_SKILL]->(:Skill)
    DELETE old
    WITH u
    UNWIND $skills AS skill
    MERGE (s:Skill {name: skill})
    MERGE (u)-[:HAS_SKILL]->(s)
    RETURN u, collect(distinct s.name) as skills
    """
    record = session.run(
        query,
        id=user_id,
        name=user.name,
        email=user.email,
        bio=user.bio,
        visibility=user.privacy.visibility,
        consent=user.privacy.consent_to_share,
        allow_contact=user.privacy.allow_contact,
        skills=user.skills,
    ).single()
    data = user_record_to_dict(record)
    _authorize_user(data, user_id, True)
    return data


@app.post("/users", response_model=UserProfile)
def create_user(profile: UserProfileCreate, session: Session = Depends(get_session)):
    return _persist_user(session, profile)


@app.get("/users/{user_id}", response_model=UserProfile)
def get_user(
    user_id: str,
    viewer_id: Optional[str] = Query(default=None),
    include_private: bool = Query(default=False),
    session: Session = Depends(get_session),
):
    record = _run_user_query(session, user_id)
    if not record:
        raise HTTPException(status_code=404, detail="User not found")
    _authorize_user(record, viewer_id, include_private)
    return record


@app.put("/users/{user_id}", response_model=UserProfile)
def update_user(
    user_id: str,
    profile: UserProfileCreate,
    session: Session = Depends(get_session),
):
    profile.id = user_id
    return _persist_user(session, profile)


@app.delete("/users/{user_id}")
def delete_user(user_id: str, session: Session = Depends(get_session)):
    query = """
    MATCH (u:User {id: $id})
    SET u.deleted=true, u.email=null, u.bio=null
    RETURN u
    """
    record = session.run(query, id=user_id).single()
    if not record:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "deleted", "id": user_id}


@app.get("/users", response_model=List[UserProfile])
def list_users(
    viewer_id: Optional[str] = Query(default=None),
    include_private: bool = Query(default=False),
    session: Session = Depends(get_session),
):
    return _list_users(session, viewer_id, include_private)


@app.post("/opportunities", response_model=Opportunity)
def create_opportunity(
    opportunity: OpportunityCreate,
    session: Session = Depends(get_session),
):
    opp_id = generate_id(opportunity.id)
    query = """
    MATCH (owner:User {id: $owner_id})
    WHERE coalesce(owner.deleted, false) = false
    MERGE (o:Opportunity {id: $id})
    SET o.title=$title,
        o.description=$description,
        o.visibility=$visibility,
        o.tags=$tags,
        o.created_at=coalesce(o.created_at, datetime())
    WITH o, owner
    OPTIONAL MATCH (o)-[old:NEEDS_SKILL]->(:Skill)
    DELETE old
    WITH o, owner
    UNWIND $required_skills AS skill
    MERGE (s:Skill {name: skill})
    MERGE (o)-[:NEEDS_SKILL]->(s)
    MERGE (owner)-[:POSTED]->(o)
    RETURN o, collect(distinct s.name) as required_skills
    """
    record = session.run(
        query,
        owner_id=opportunity.owner_id,
        id=opp_id,
        title=opportunity.title,
        description=opportunity.description,
        visibility=opportunity.visibility,
        required_skills=opportunity.required_skills,
        tags=opportunity.tags,
    ).single()
    if not record:
        raise HTTPException(status_code=404, detail="Owner not found")
    return opportunity_record_to_dict(record)


@app.get("/opportunities/{opportunity_id}", response_model=Opportunity)
def get_opportunity(
    opportunity_id: str,
    viewer_id: Optional[str] = Query(default=None),
    include_private: bool = Query(default=False),
    session: Session = Depends(get_session),
):
    query = """
    MATCH (o:Opportunity {id: $id})
    OPTIONAL MATCH (o)<-[:POSTED]-(owner:User)
    OPTIONAL MATCH (o)-[:NEEDS_SKILL]->(s:Skill)
    RETURN o, owner.id AS owner_id, collect(distinct s.name) as required_skills
    """
    record = session.run(query, id=opportunity_id).single()
    if not record:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    owner_id = record.get("owner_id")
    data = opportunity_record_to_dict(record)
    visibility = data.get("visibility", "public")
    if visibility == "private" and viewer_id != owner_id and not include_private:
        raise HTTPException(status_code=403, detail="Opportunity is private")
    return data


@app.put("/opportunities/{opportunity_id}", response_model=Opportunity)
def update_opportunity(
    opportunity_id: str,
    opportunity: OpportunityCreate,
    session: Session = Depends(get_session),
):
    opportunity.id = opportunity_id
    return create_opportunity(opportunity, session)


@app.delete("/opportunities/{opportunity_id}")
def delete_opportunity(opportunity_id: str, session: Session = Depends(get_session)):
    query = """
    MATCH (o:Opportunity {id: $id})
    DETACH DELETE o
    RETURN $id AS id
    """
    record = session.run(query, id=opportunity_id).single()
    if not record:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return {"status": "deleted", "id": opportunity_id}


@app.get("/opportunities", response_model=List[Opportunity])
def list_opportunities(
    viewer_id: Optional[str] = Query(default=None),
    include_private: bool = Query(default=False),
    session: Session = Depends(get_session),
):
    query = """
    MATCH (o:Opportunity)
    OPTIONAL MATCH (o)-[:NEEDS_SKILL]->(s:Skill)
    OPTIONAL MATCH (o)<-[:POSTED]-(owner:User)
    RETURN o, owner.id as owner_id, collect(distinct s.name) as required_skills
    """
    results = []
    for record in session.run(query):
        data = opportunity_record_to_dict(record)
        owner_id = record.get("owner_id")
        if (
            data.get("visibility", "public") == "private"
            and viewer_id != owner_id
            and not include_private
        ):
            continue
        results.append(data)
    return results


@app.post("/knowledge", response_model=Knowledge)
def create_knowledge(
    knowledge: KnowledgeCreate,
    session: Session = Depends(get_session),
):
    knowledge_id = generate_id(knowledge.id)
    query = """
    MATCH (u:User {id: $user_id})
    WHERE coalesce(u.deleted, false) = false
    MERGE (k:Knowledge {id: $id})
    SET k.title=$title,
        k.content=$content,
        k.tags=$tags,
        k.visibility=$visibility,
        k.retention_policy=$retention,
        k.created_at=coalesce(k.created_at, datetime())
    MERGE (u)-[:KNOWS]->(k)
    RETURN k
    """
    record = session.run(
        query,
        user_id=knowledge.user_id,
        id=knowledge_id,
        title=knowledge.title,
        content=knowledge.content,
        tags=knowledge.tags,
        visibility=knowledge.visibility,
        retention=knowledge.retention_policy,
    ).single()
    if not record:
        raise HTTPException(status_code=404, detail="User not found")
    return knowledge_record_to_dict(record)


@app.put("/knowledge/{knowledge_id}", response_model=Knowledge)
def update_knowledge(
    knowledge_id: str,
    knowledge: KnowledgeCreate,
    session: Session = Depends(get_session),
):
    knowledge.id = knowledge_id
    return create_knowledge(knowledge, session)


@app.get("/knowledge/{knowledge_id}", response_model=Knowledge)
def get_knowledge(
    knowledge_id: str,
    viewer_id: Optional[str] = Query(default=None),
    include_private: bool = Query(default=False),
    session: Session = Depends(get_session),
):
    query = """
    MATCH (k:Knowledge {id: $id})<-[:KNOWS]-(u:User)
    RETURN k, u.id as owner_id
    """
    record = session.run(query, id=knowledge_id).single()
    if not record:
        raise HTTPException(status_code=404, detail="Knowledge not found")
    owner_id = record.get("owner_id")
    knowledge = knowledge_record_to_dict(record)
    visibility = knowledge.get("visibility", "private")
    if visibility == "private" and viewer_id != owner_id and not include_private:
        raise HTTPException(status_code=403, detail="Knowledge is private")
    if knowledge.get("retention_policy") == "restricted" and viewer_id != owner_id:
        raise HTTPException(status_code=403, detail="Restricted memory")
    return knowledge


@app.get("/knowledge", response_model=List[Knowledge])
def list_knowledge(
    viewer_id: Optional[str] = Query(default=None),
    include_private: bool = Query(default=False),
    session: Session = Depends(get_session),
):
    query = """
    MATCH (k:Knowledge)<-[:KNOWS]-(u:User)
    RETURN k, u.id as owner_id
    """
    results = []
    for record in session.run(query):
        owner_id = record.get("owner_id")
        knowledge = knowledge_record_to_dict(record)
        visibility = knowledge.get("visibility", "private")
        if visibility == "private" and viewer_id != owner_id and not include_private:
            continue
        if knowledge.get("retention_policy") == "restricted" and viewer_id != owner_id:
            continue
        results.append(knowledge)
    return results


@app.delete("/knowledge/{knowledge_id}")
def delete_knowledge(knowledge_id: str, session: Session = Depends(get_session)):
    query = """
    MATCH (k:Knowledge {id: $id})
    DETACH DELETE k
    RETURN $id as id
    """
    record = session.run(query, id=knowledge_id).single()
    if not record:
        raise HTTPException(status_code=404, detail="Knowledge not found")
    return {"status": "deleted", "id": knowledge_id}


@app.post("/metrics", response_model=Metric)
def create_metric(metric: MetricCreate, session: Session = Depends(get_session)):
    metric_id = generate_id(metric.id)
    query = """
    MATCH (u:User {id: $user_id})
    WHERE coalesce(u.deleted, false) = false
    MERGE (m:Metric {id: $id})
    SET m.metric_type=$metric_type,
        m.value=$value,
        m.observed_at=$observed_at
    MERGE (u)-[:MEASURED]->(m)
    RETURN m
    """
    record = session.run(
        query,
        user_id=metric.user_id,
        id=metric_id,
        metric_type=metric.metric_type,
        value=metric.value,
        observed_at=metric.observed_at,
    ).single()
    if not record:
        raise HTTPException(status_code=404, detail="User not found")
    return metric_record_to_dict(record)


@app.put("/metrics/{metric_id}", response_model=Metric)
def update_metric(
    metric_id: str, metric: MetricCreate, session: Session = Depends(get_session)
):
    metric.id = metric_id
    return create_metric(metric, session)


@app.get("/metrics", response_model=List[Metric])
def list_metrics(
    user_id: Optional[str] = Query(default=None),
    viewer_id: Optional[str] = Query(default=None),
    session: Session = Depends(get_session),
):
    clauses = ["MATCH (m:Metric)<-[:MEASURED]-(u:User)"]
    params = {}
    if user_id:
        clauses.append("WHERE u.id = $user_id")
        params["user_id"] = user_id
    query = "\n".join(clauses) + "\nRETURN m, u.id as owner_id"
    results = []
    for record in session.run(query, **params):
        owner_id = record.get("owner_id")
        metric = metric_record_to_dict(record)
        if viewer_id not in {owner_id, None}:
            continue
        results.append(metric)
    return results


@app.delete("/metrics/{metric_id}")
def delete_metric(metric_id: str, session: Session = Depends(get_session)):
    query = """
    MATCH (m:Metric {id: $id})
    DETACH DELETE m
    RETURN $id as id
    """
    record = session.run(query, id=metric_id).single()
    if not record:
        raise HTTPException(status_code=404, detail="Metric not found")
    return {"status": "deleted", "id": metric_id}


@app.post("/matches/opportunities", response_model=List[MatchResult])
def match_opportunities(
    request: MatchRequest,
    session: Session = Depends(get_session),
):
    skills = request.skills
    if request.user_id:
        user_data = _run_user_query(session, request.user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found for matching")
        skills = user_data.get("skills", [])
    if not skills:
        raise HTTPException(status_code=400, detail="No skills provided for matching")

    query = """
    MATCH (o:Opportunity)
    OPTIONAL MATCH (o)-[:NEEDS_SKILL]->(s:Skill)
    OPTIONAL MATCH (o)<-[:POSTED]-(owner:User)
    WITH o, owner, collect(distinct s.name) as required_skills
    WITH o, owner, required_skills, [skill IN required_skills WHERE skill IN $skills] AS overlap
    WHERE size(overlap) >= $minimum_overlap
    RETURN o, owner.id as owner_id, required_skills, overlap, size(overlap) as overlap_count
    ORDER BY overlap_count DESC
    """
    results = []
    for record in session.run(
        query, skills=skills, minimum_overlap=request.minimum_overlap
    ):
        opp = opportunity_record_to_dict(record)
        owner_id = record.get("owner_id")
        if opp.get("visibility", "public") == "private" and request.viewer_id != owner_id:
            continue
        results.append(
            MatchResult(
                opportunity=Opportunity(**opp),
                overlap_count=record.get("overlap_count"),
                matching_skills=record.get("overlap", []),
            )
        )
    return results


@app.post("/memory", response_model=Knowledge)
def create_memory(entry: MemoryRequest, session: Session = Depends(get_session)):
    knowledge = KnowledgeCreate(
        id=entry.ensure_id(),
        user_id=entry.user_id,
        title="Long-term memory entry",
        content=entry.content,
        tags=entry.tags,
        visibility=entry.visibility,
        retention_policy=entry.retention_policy,
    )
    return create_knowledge(knowledge, session)


@app.get("/identity/domains", response_model=List[str])
def list_trusted_domains():
    return sorted(domain for domain in authenticated_domains if domain)

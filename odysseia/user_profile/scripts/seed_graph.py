"""Seed script to populate the talent graph with demo data."""
import os
from uuid import uuid4

from neo4j import GraphDatabase

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")


seed_users = [
    {
        "id": str(uuid4()),
        "name": "Alex Rivera",
        "email": "alex@example.com",
        "bio": "Full-stack engineer building graph-native apps",
        "skills": ["python", "neo4j", "fastapi"],
        "privacy": {"visibility": "public", "consent_to_share": True, "allow_contact": False},
    },
    {
        "id": str(uuid4()),
        "name": "Sam Lee",
        "email": "sam@example.com",
        "bio": "Product strategist mapping opportunities to skills",
        "skills": ["product", "roadmaps", "research"],
        "privacy": {"visibility": "internal", "consent_to_share": True, "allow_contact": True},
    },
]

seed_opportunities = [
    {
        "id": str(uuid4()),
        "title": "Graph Platform Lead",
        "description": "Lead development for Reveta OS graph services",
        "required_skills": ["neo4j", "python", "architecture"],
        "owner_index": 0,
        "visibility": "public",
        "tags": ["leadership", "platform"],
    },
    {
        "id": str(uuid4()),
        "title": "Insights Analyst",
        "description": "Turn knowledge graph metrics into insights",
        "required_skills": ["analytics", "research", "storytelling"],
        "owner_index": 1,
        "visibility": "internal",
        "tags": ["analysis"],
    },
]

seed_knowledge = [
    {
        "id": str(uuid4()),
        "title": "Memory: Launch checklist",
        "content": "Document critical steps for launch readiness.",
        "tags": ["process", "playbook"],
        "visibility": "private",
        "retention_policy": "long_term",
        "owner_index": 0,
    }
]

seed_metrics = [
    {
        "id": str(uuid4()),
        "metric_type": "profile_completeness",
        "value": 0.8,
        "owner_index": 0,
    },
    {
        "id": str(uuid4()),
        "metric_type": "matches_served",
        "value": 5,
        "owner_index": 1,
    },
]


def run_seed():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        for user in seed_users:
            session.run(
                """
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
                UNWIND $skills AS skill
                MERGE (s:Skill {name: skill})
                MERGE (u)-[:HAS_SKILL]->(s)
                """,
                **user,
                visibility=user["privacy"]["visibility"],
                consent=user["privacy"]["consent_to_share"],
                allow_contact=user["privacy"]["allow_contact"],
            )

        for opportunity in seed_opportunities:
            owner = seed_users[opportunity.pop("owner_index")]
            session.run(
                """
                MATCH (owner:User {id: $owner_id})
                MERGE (o:Opportunity {id: $id})
                SET o.title=$title,
                    o.description=$description,
                    o.visibility=$visibility,
                    o.tags=$tags,
                    o.created_at=coalesce(o.created_at, datetime())
                WITH o, owner
                UNWIND $required_skills AS skill
                MERGE (s:Skill {name: skill})
                MERGE (o)-[:NEEDS_SKILL]->(s)
                MERGE (owner)-[:POSTED]->(o)
                """,
                owner_id=owner["id"],
                **opportunity,
            )

        for knowledge in seed_knowledge:
            owner = seed_users[knowledge.pop("owner_index")]
            session.run(
                """
                MATCH (u:User {id: $user_id})
                MERGE (k:Knowledge {id: $id})
                SET k.title=$title,
                    k.content=$content,
                    k.tags=$tags,
                    k.visibility=$visibility,
                    k.retention_policy=$retention_policy,
                    k.created_at=coalesce(k.created_at, datetime())
                MERGE (u)-[:KNOWS]->(k)
                """,
                user_id=owner["id"],
                **knowledge,
            )

        for metric in seed_metrics:
            owner = seed_users[metric.pop("owner_index")]
            session.run(
                """
                MATCH (u:User {id: $user_id})
                MERGE (m:Metric {id: $id})
                SET m.metric_type=$metric_type,
                    m.value=$value,
                    m.observed_at=datetime()
                MERGE (u)-[:MEASURED]->(m)
                """,
                user_id=owner["id"],
                **metric,
            )
    driver.close()


if __name__ == "__main__":
    run_seed()
    print("Seed data written to Neo4j")

import os
from contextlib import contextmanager
from typing import Dict, List, Optional
from uuid import uuid4

from neo4j import GraphDatabase, Session

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")


def create_driver():
    return GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))


driver = create_driver()


@contextmanager
def get_session() -> Session:
    session = driver.session()
    try:
        yield session
    finally:
        session.close()


def close_driver():
    driver.close()


def ensure_list(value: Optional[List[str]]) -> List[str]:
    return value if value is not None else []


def scrub_contact(data: Dict, owner_id: Optional[str], viewer_id: Optional[str]):
    if not data.get("privacy", {}).get("allow_contact", False) and viewer_id != owner_id:
        data["email"] = None


def forbid_without_consent(data: Dict, viewer_id: Optional[str], include_private: bool):
    if data.get("privacy", {}).get("consent_to_share", True) is False and viewer_id != data.get("id"):
        if not include_private:
            raise PermissionError("User has not consented to sharing this profile.")


def enforce_visibility(data: Dict, viewer_id: Optional[str], include_private: bool):
    visibility = data.get("privacy", {}).get("visibility", "public")
    if visibility == "private" and viewer_id != data.get("id") and not include_private:
        raise PermissionError("Profile is private.")


def user_record_to_dict(record) -> Dict:
    user_props = dict(record["u"])
    user_props.setdefault("privacy", {})
    user_props["privacy"] = {
        "visibility": user_props.get("visibility", "public"),
        "consent_to_share": user_props.get("consent_to_share", True),
        "allow_contact": user_props.get("allow_contact", False),
    }
    user_props["skills"] = record.get("skills", [])
    user_props["id"] = user_props.get("id")
    user_props["created_at"] = user_props.get("created_at")
    return user_props


def opportunity_record_to_dict(record) -> Dict:
    opp_props = dict(record["o"])
    opp_props["required_skills"] = record.get("required_skills", [])
    opp_props["tags"] = opp_props.get("tags", [])
    opp_props["id"] = opp_props.get("id")
    opp_props["created_at"] = opp_props.get("created_at")
    return opp_props


def knowledge_record_to_dict(record) -> Dict:
    knowledge_props = dict(record["k"])
    knowledge_props["tags"] = ensure_list(knowledge_props.get("tags"))
    knowledge_props["id"] = knowledge_props.get("id")
    knowledge_props["created_at"] = knowledge_props.get("created_at")
    return knowledge_props


def metric_record_to_dict(record) -> Dict:
    metric_props = dict(record["m"])
    metric_props["id"] = metric_props.get("id")
    return metric_props


def generate_id(value: Optional[str] = None) -> str:
    return value or str(uuid4())

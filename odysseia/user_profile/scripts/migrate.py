"""Migration script to prepare Neo4j constraints for the talent graph service."""
import os
from neo4j import GraphDatabase

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")


def run_migrations():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (o:Opportunity) REQUIRE o.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (k:Knowledge) REQUIRE k.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (m:Metric) REQUIRE m.id IS UNIQUE")
        session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE")
    driver.close()


if __name__ == "__main__":
    run_migrations()
    print("Constraints ensured for Users, Opportunities, Knowledge, Metrics, and Skills")

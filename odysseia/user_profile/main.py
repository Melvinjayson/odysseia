from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import uuid

app = FastAPI()

# Mocked Neo4j as in-memory dict
users: Dict[str, dict] = {}

class UserProfile(BaseModel):
    id: str = None
    name: str
    email: str
    bio: str = ""

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/users", response_model=UserProfile)
def create_user(profile: UserProfile):
    user_id = str(uuid.uuid4())
    profile.id = user_id
    users[user_id] = profile.dict()
    return profile

@app.get("/users/{user_id}", response_model=UserProfile)
def get_user(user_id: str):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    return users[user_id]

@app.put("/users/{user_id}", response_model=UserProfile)
def update_user(user_id: str, profile: UserProfile):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    profile.id = user_id
    users[user_id] = profile.dict()
    return profile

@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    del users[user_id]
    return {"status": "deleted"}

@app.get("/users", response_model=list[UserProfile])
def list_users():
    return list(users.values())

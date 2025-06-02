from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PlanRequest(BaseModel):
    prompt: str

class PlanResponse(BaseModel):
    plan: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/plan", response_model=PlanResponse)
def get_plan(req: PlanRequest):
    # Mocked planning
    return {"plan": f"Timeline and plan for: {req.prompt}"}

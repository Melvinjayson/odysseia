from fastapi import FastAPI
from pydantic import BaseModel
import httpx

app = FastAPI()

class AgentRequest(BaseModel):
    prompt: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/mentis/strategy")
async def mentis_strategy(req: AgentRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.post("http://mentis:8000/strategy", json={"prompt": req.prompt})
        return resp.json()

@app.post("/chronos/plan")
async def chronos_plan(req: AgentRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.post("http://chronos:8000/plan", json={"prompt": req.prompt})
        return resp.json()

@app.post("/orchestrate")
async def orchestrate(req: AgentRequest):
    async with httpx.AsyncClient() as client:
        strat = await client.post("http://mentis:8000/strategy", json={"prompt": req.prompt})
        plan = await client.post("http://chronos:8000/plan", json={"prompt": req.prompt})
        return {"strategy": strat.json().get("strategy"), "plan": plan.json().get("plan")}

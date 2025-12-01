import os

import httpx
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class TaskExecutionRequest(BaseModel):
    user_id: str
    goal: str
    context: dict | None = None


class TaskExecutionResponse(BaseModel):
    plan: dict
    sesame_receipt: dict
    memory_reference: str


class OpportunityRequest(BaseModel):
    user_id: str
    context: dict | None = None


class OpportunityResponse(BaseModel):
    opportunities: list[dict]
    reasoning: str
    memory_reference: str


GEMINI_URL = os.getenv("GEMINI_URL", "http://gemini:8080")
SESAME_URL = os.getenv("SESAME_URL", "http://sesame:8080")
REVETA_URL = os.getenv("REVETA_URL", "http://reveta:8080")


@app.get("/health")
def health():
    return {"status": "ok"}


async def _ask_gemini_for_plan(client: httpx.AsyncClient, goal: str, context: dict | None) -> dict:
    resp = await client.post(f"{GEMINI_URL}/plan", json={"goal": goal, "context": context, "long_context": True})
    return resp.json().get("plan", {})


async def _dispatch_to_sesame(client: httpx.AsyncClient, plan: dict, user_id: str) -> dict:
    resp = await client.post(f"{SESAME_URL}/execute", json={"plan": plan, "user_id": user_id})
    return resp.json()


async def _save_memory(client: httpx.AsyncClient, user_id: str, payload: dict) -> str:
    resp = await client.post(f"{REVETA_URL}/memory", json={"user_id": user_id, "interaction": payload})
    return resp.json().get("memory_id", "")


async def _find_opportunities(client: httpx.AsyncClient, user_id: str, context: dict | None) -> tuple[list[dict], dict]:
    resp = await client.post(
        f"{GEMINI_URL}/opportunities",
        json={"user_id": user_id, "context": context, "long_context": True},
    )
    data = resp.json()
    return data.get("opportunities", []), data


@app.post("/tasks/execute", response_model=TaskExecutionResponse)
async def execute_task(req: TaskExecutionRequest):
    async with httpx.AsyncClient() as client:
        plan = await _ask_gemini_for_plan(client, req.goal, req.context)
        sesame_receipt = await _dispatch_to_sesame(client, plan, req.user_id)
        memory_reference = await _save_memory(
            client,
            user_id=req.user_id,
            payload={"plan": plan, "execution": sesame_receipt, "context": req.context},
        )

        return TaskExecutionResponse(plan=plan, sesame_receipt=sesame_receipt, memory_reference=memory_reference)


@app.post("/opportunities", response_model=OpportunityResponse)
async def opportunity_flow(req: OpportunityRequest):
    async with httpx.AsyncClient() as client:
        opportunities, reasoning = await _find_opportunities(client, req.user_id, req.context)
        memory_reference = await _save_memory(
            client,
            user_id=req.user_id,
            payload={"opportunities": opportunities, "reasoning": reasoning},
        )

        return OpportunityResponse(
            opportunities=opportunities,
            reasoning=reasoning.get("thought", ""),
            memory_reference=memory_reference,
        )

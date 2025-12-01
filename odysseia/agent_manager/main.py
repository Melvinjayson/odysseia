import os
from typing import Any

import httpx
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class LayerBinding(BaseModel):
    layer: str
    service: str
    endpoint: str


class ConversationRequest(BaseModel):
    user_id: str
    utterance: str
    persona_id: str | None = None
    emotional_state: str | None = None
    voice_input_url: str | None = None


class TaskExecutionRequest(BaseModel):
    user_id: str
    goal: str
    context: dict | None = None


class OpportunityRequest(BaseModel):
    user_id: str
    context: dict | None = None


MENTIS_URL = os.getenv("MENTIS_URL", "http://mentis:8000")
CHRONOS_URL = os.getenv("CHRONOS_URL", "http://chronos:8000")
INWORLD_URL = os.getenv("INWORLD_URL", "http://inworld:8080")
ELEVENLABS_URL = os.getenv("ELEVENLABS_URL", "http://elevenlabs:8080")
GEMINI_URL = os.getenv("GEMINI_URL", "http://gemini:8080")
SESAME_URL = os.getenv("SESAME_URL", "http://sesame:8080")
REVETA_URL = os.getenv("REVETA_URL", "http://reveta:8080")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/layers", response_model=list[LayerBinding])
def layer_map():
    return [
        LayerBinding(layer="Inworld persona", service="inworld", endpoint=f"{INWORLD_URL}/dialog"),
        LayerBinding(layer="ElevenLabs voice I/O", service="elevenlabs", endpoint=f"{ELEVENLABS_URL}/synthesize"),
        LayerBinding(layer="Gemini 3 cognitive core", service="gemini", endpoint=f"{GEMINI_URL}/reason"),
        LayerBinding(layer="Sesame execution", service="sesame", endpoint=f"{SESAME_URL}/execute"),
        LayerBinding(layer="Reveta data layer", service="reveta", endpoint=f"{REVETA_URL}/memory"),
        LayerBinding(
            layer="Odysseia narrative", service="agent_manager", endpoint="/conversation|/tasks/execute|/opportunities"
        ),
    ]


async def _forward(client: httpx.AsyncClient, url: str, payload: dict) -> Any:
    resp = await client.post(url, json=payload)
    resp.raise_for_status()
    return resp.json()


@app.post("/conversation")
async def orchestrate_conversation(req: ConversationRequest):
    async with httpx.AsyncClient() as client:
        mentis_response = await _forward(client, f"{MENTIS_URL}/conversation", req.dict())
        return {
            "narrative_layer": {
                "persona_reply": mentis_response.get("persona_response", {}),
                "reasoning": mentis_response.get("reasoning"),
            },
            "memory_reference": mentis_response.get("memory_reference"),
        }


@app.post("/tasks/execute")
async def orchestrate_task(req: TaskExecutionRequest):
    async with httpx.AsyncClient() as client:
        chronos_response = await _forward(client, f"{CHRONOS_URL}/tasks/execute", req.dict())
        return {
            "narrative_layer": {
                "plan": chronos_response.get("plan"),
                "execution": chronos_response.get("sesame_receipt"),
            },
            "memory_reference": chronos_response.get("memory_reference"),
        }


@app.post("/opportunities")
async def orchestrate_opportunities(req: OpportunityRequest):
    async with httpx.AsyncClient() as client:
        chronos_response = await _forward(client, f"{CHRONOS_URL}/opportunities", req.dict())
        return {
            "narrative_layer": {
                "opportunities": chronos_response.get("opportunities"),
                "reasoning": chronos_response.get("reasoning"),
            },
            "memory_reference": chronos_response.get("memory_reference"),
        }

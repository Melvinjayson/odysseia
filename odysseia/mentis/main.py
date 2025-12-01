import os

import httpx
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class ConversationRequest(BaseModel):
    user_id: str
    utterance: str
    persona_id: str | None = None
    emotional_state: str | None = None
    voice_input_url: str | None = None


class ConversationTurn(BaseModel):
    text: str
    voice_url: str | None = None
    emotion: str | None = None


class ConversationResponse(BaseModel):
    persona_response: ConversationTurn
    reasoning: str
    memory_reference: str


ELEVENLABS_URL = os.getenv("ELEVENLABS_URL", "http://elevenlabs:8080")
INWORLD_URL = os.getenv("INWORLD_URL", "http://inworld:8080")
GEMINI_URL = os.getenv("GEMINI_URL", "http://gemini:8080")
REVETA_URL = os.getenv("REVETA_URL", "http://reveta:8080")


@app.get("/health")
def health():
    return {"status": "ok"}


async def _transcribe_voice(client: httpx.AsyncClient, audio_url: str | None, fallback: str) -> str:
    if not audio_url:
        return fallback

    resp = await client.post(f"{ELEVENLABS_URL}/transcribe", json={"audio_url": audio_url})
    data = resp.json()
    return data.get("text", fallback)


async def _send_to_inworld(client: httpx.AsyncClient, text: str, persona_id: str | None, emotion: str | None) -> dict:
    payload = {"text": text, "emotion": emotion}
    if persona_id:
        payload["persona_id"] = persona_id

    resp = await client.post(f"{INWORLD_URL}/dialog", json=payload)
    return resp.json()


async def _reason_with_gemini(client: httpx.AsyncClient, user_id: str, utterance: str, persona_reply: str) -> dict:
    resp = await client.post(
        f"{GEMINI_URL}/reason",
        json={
            "user_id": user_id,
            "prompt": utterance,
            "assistant_reply": persona_reply,
            "long_context": True,
        },
    )
    return resp.json()


async def _persist_memory(client: httpx.AsyncClient, user_id: str, interaction: dict) -> str:
    resp = await client.post(f"{REVETA_URL}/memory", json={"user_id": user_id, "interaction": interaction})
    data = resp.json()
    return data.get("memory_id", "")


async def _synthesize_voice(client: httpx.AsyncClient, text: str, emotion: str | None) -> str | None:
    resp = await client.post(f"{ELEVENLABS_URL}/synthesize", json={"text": text, "emotion": emotion})
    data = resp.json()
    return data.get("audio_url")


@app.post("/conversation", response_model=ConversationResponse)
async def handle_conversation(req: ConversationRequest):
    async with httpx.AsyncClient() as client:
        spoken_text = await _transcribe_voice(client, req.voice_input_url, req.utterance)
        persona_result = await _send_to_inworld(client, spoken_text, req.persona_id, req.emotional_state)

        reasoning = await _reason_with_gemini(
            client, user_id=req.user_id, utterance=spoken_text, persona_reply=persona_result.get("reply", "")
        )

        memory_id = await _persist_memory(
            client,
            user_id=req.user_id,
            interaction={
                "user": spoken_text,
                "assistant": persona_result.get("reply"),
                "emotion": persona_result.get("emotion"),
                "reasoning": reasoning.get("thought"),
            },
        )

        voice_url = await _synthesize_voice(client, persona_result.get("reply", ""), persona_result.get("emotion"))

        return ConversationResponse(
            persona_response=ConversationTurn(
                text=persona_result.get("reply", ""),
                voice_url=voice_url,
                emotion=persona_result.get("emotion"),
            ),
            reasoning=reasoning.get("thought", ""),
            memory_reference=memory_id,
        )

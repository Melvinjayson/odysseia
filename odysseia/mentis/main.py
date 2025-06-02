from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class StrategyRequest(BaseModel):
    prompt: str

class StrategyResponse(BaseModel):
    strategy: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/strategy", response_model=StrategyResponse)
def get_strategy(req: StrategyRequest):
    # Mocked strategic guidance
    return {"strategy": f"Strategic guidance for: {req.prompt}"}

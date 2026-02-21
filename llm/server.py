from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from llm import LLMModel

app = FastAPI(title="LLM Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
HOST = "0.0.0.0"
PORT = 6767
DEBUG = True


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "LLM Backend API is running"}


@app.post("/process")
async def process_llm(llm_data: LLMModel):
    """Process LLM data"""
    return {
        "status": "success",
        "data": llm_data.dict(),
        "message": f"Received message from {llm_data.username}: {llm_data.message}"
    }


@app.get("/status")
async def status():
    """Get server status"""
    return {
        "status": "online",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
        log_level="info"
    )

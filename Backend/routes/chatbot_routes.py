# Backend/routes/chatbot_routes.py
from fastapi import APIRouter
from pydantic import BaseModel

try:
    from ..controllers.chatbot_controller import get_chat_response
except ImportError:
    from controllers.chatbot_controller import get_chat_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response = get_chat_response(request.message)
    return {"reply": response}

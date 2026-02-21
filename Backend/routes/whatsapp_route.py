from fastapi import APIRouter,Form,Request
import controllers.whatsapp_controller as whatsapp_controller
from pydantic import BaseModel
router = APIRouter()

class WhatsAppPayload(BaseModel):
    user: str
    message: str

@router.post("/whatsapp")
def whatsapp_webhook(request: Request, Body: str = Form(...)):
    return whatsapp_controller.whatsapp_webhook(request, Body)
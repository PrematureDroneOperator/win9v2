# main.py
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI, Request, Form
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
app=FastAPI()

try:
    from .agent import agent_reply
    from .routes import chatbot_routes, tracking_routes, login_route, signup_route, whatsapp_route, rides_route
except ImportError:
    from agent import agent_reply
    from routes import chatbot_routes, tracking_routes, login_route, signup_route, whatsapp_route, rides_route

# Add CORS middleware to allow frontend communication
cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(chatbot_routes.router, prefix="/api")
app.include_router(tracking_routes.router, prefix="/api")
app.include_router(login_route.router, prefix="/api")
app.include_router(signup_route.router, prefix="/api")
app.include_router(whatsapp_route.router, prefix="/api")
app.include_router(rides_route.router, prefix="/api")

# # Define the request body schema
# class WhatsAppPayload(BaseModel):
#     user: str
#     message: str

# @app.post("/webhook")
# async def whatsapp_webhook(payload: WhatsAppPayload):
#     # Access validated fields
#     user_id = payload.user
#     message = payload.message

#     reply = agent_reply(user_id, message)

#     return {"reply": reply}


@app.get("/")
def root():
    return {"status": "FastAPI + Supabase working!"}

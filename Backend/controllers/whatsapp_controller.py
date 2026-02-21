from fastapi import FastAPI, Request, Form, Response
from twilio.twiml.messaging_response import MessagingResponse
from controllers.chatbot_controller import get_chat_response


async def whatsapp_webhook(
    request: Request,
    Body: str = Form(...)
):
    print("User said:", Body)

    response = MessagingResponse()
    msg = response.message()

    reply = get_chat_response(Body)
    msg.body(reply)

    return Response(content=str(response), media_type="application/xml")
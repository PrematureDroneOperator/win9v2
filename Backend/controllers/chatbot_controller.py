# Backend/controllers/chatbot_controller.py

def get_chat_response(user_message: str):
    """
    A dummy function to handle chatbot logic.
    In the future, this can be integrated with AI models.
    """
    # Simple keyword-based dummy logic
    msg = user_message.lower()
    
    if "hello" in msg or "hi" in msg:
        return "Hello! I am your Roadचल assistant. How can I help you today?"
    elif "metro" in msg:
        return "The Pune Metro is a great way to travel! Which station are you looking for?"
    elif "fare" in msg:
        return "Metro fares are affordable, starting from ₹10."
    else:
        return f"You said: '{user_message}'. I'm still learning, but I'm here to help!"

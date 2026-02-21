# memory.py

user_sessions = {}

def get_session(user_id):
    if user_id not in user_sessions:
        user_sessions[user_id] = {
            "state": "idle",
            "pickup": None,
            "destination": None,
            "ride_type": None
        }
        print(f"New session created for user: {user_id}")
        print(f"Current active sessions: {user_sessions}")
    return user_sessions[user_id]

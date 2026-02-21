# agent.py
try:
    from .memory import get_session
    from .tools import find_route, book_ride
except ImportError:
    from memory import get_session
    from tools import find_route, book_ride

def agent_reply(user_id, message):

    session = get_session(user_id)
    msg = message.lower()

    # ---- STEP 1: destination detection ----
    if "metro" in msg or "station" in msg:
        session["destination"] = message
        session["state"] = "await_pickup"
        print("the session is - ", session)
        return "Please share your pickup location."

    # ---- STEP 2: pickup received ----
    if session["state"] == "await_pickup":
        session["pickup"] = message

        route = find_route(session["pickup"],
                           session["destination"])

        session["state"] = "choose_ride"

        # return (
        #     f"Distance: {route['distance']}\n"
        #     f"ETA: {route['duration']}\n\n"
        #     "Choose ride:\n"
        #     "1️⃣ Auto\n"
        #     "2️⃣ Bike Taxi"
        # )
        return (
            f"{route}\n\n"
            "Choose ride:\n"
            "1️⃣ Auto\n"
            "2️⃣ Bike Taxi"
        )

    # ---- STEP 3: booking ----
    if session["state"] == "choose_ride":
        if "1" not in msg and "2" not in msg:
            return "Please choose a ride by replying with 1 for Auto or 2 for Bike Taxi."

        ride = "Auto" if "1" in msg else "Bike"

        booking = book_ride(user_id, ride)

        session["state"] = "ride_booked"

        return (
            f"✅ {ride} booked!\n"
            f"Driver: {booking['driver']}\n"
            f"Arriving in {booking['eta']}"
        )

    return "Hi! Tell me where you want to go (e.g., Akurdi Metro)."

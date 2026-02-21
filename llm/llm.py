from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from enum import Enum
import uuid
import math
import requests

# =============================
# CONFIG
# =============================

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
WHATSAPP_API = "http://localhost:8001/send"

SUPABASE_URL = "YOUR_URL"
SUPABASE_KEY = "YOUR_KEY"

# =============================
# ROUTER
# =============================

router = APIRouter(prefix="/stark")

# =============================
# STATE ENUM
# =============================

class StateEnum(str, Enum):
    START = "start"
    INTRANSIT1 = "intransit1"
    MID = "mid"
    INTRANSIT2 = "intransit2"
    END = "end"


# =============================
# INPUT MODEL
# =============================

class LLMModel(BaseModel):
    message: str
    username: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


# =============================
# MEMORY (Hackathon only)
# =============================

AWAITING_DESTINATION = set()
JOURNEY_CONTEXT = {}

GREETING_MESSAGES = {"hi", "hello", "hey", "start"}


# =============================
# SUPABASE
# =============================

from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def insert_journey_details(data: dict):
    supabase.table("journeyDetails").upsert(data).execute()


# =============================
# WHATSAPP MESSAGE
# =============================

def send_message(username: str, message: str):
    try:
        requests.post(WHATSAPP_API, json={
            "username": username,
            "message": message
        })
    except Exception:
        pass


# =============================
# DISTANCE
# =============================

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1-a))


# =============================
# LLM DESTINATION EXTRACTOR
# =============================

def llm_extract_destination(message: str):
    # Placeholder — replace with Ollama later
    return {
        "name": message.title(),
        "lat": 18.735,
        "lng": 73.675
    }


# =============================
# METRO FINDER (OSM)
# =============================

def find_nearest_metro_or_direct(start, end):

    query = f"""
    [out:json];
    node["railway"="station"]["station"="subway"]
    (around:5000,{start['lat']},{start['lng']});
    out;
    """

    try:
        res = requests.post(OVERPASS_URL, data={"data": query})
        data = res.json()
    except:
        return end

    if not data.get("elements"):
        return end

    closest = None
    best = float("inf")

    for s in data["elements"]:
        dist = haversine(start["lat"], start["lng"], s["lat"], s["lon"])
        if dist < best:
            best = dist
            closest = {
                "name": s.get("tags", {}).get("name", "Metro Station"),
                "lat": s["lat"],
                "lng": s["lon"]
            }

    direct_dist = haversine(
        start["lat"], start["lng"],
        end["lat"], end["lng"]
    )

    return end if direct_dist <= best else closest


# =============================
# BOOKING AGENT (SIMULATION)
# =============================

def booking_agent_request(start, end):
    return {
        "ride_id": str(uuid.uuid4()),
        "driver": "Rahul",
        "eta": "5 mins"
    }


def confirm_booking(journey_id):
    return True


def listen_live_tracking(journey_id):
    # simulate waiting
    import time
    time.sleep(5)
    return "reached"


def get_metro_ticket(start, end):
    return "https://youtube.com/shorts/WcJEH-PpEWk?si=lmrDMesYXW9GFzJx"


def generate_qr(link):
    return f"QR({link})"


# =============================
# STATE UPDATE
# =============================

def set_state(journey_id, username, state, message):
    insert_journey_details({
        "journey_id": journey_id,
        "state": state.value
    })
    send_message(username, message)


# =============================
# MAIN WORKFLOW
# =============================

@router.post("/")
def stark(payload: LLMModel):

    username = payload.username
    message = payload.message.strip().lower()

    if not message:
        raise HTTPException(400, "message required")

    # ---- Greeting ----
    if message in GREETING_MESSAGES:
        AWAITING_DESTINATION.add(username)
        send_message(username, "Welcome to RoadChal! Where do you want to go?")
        return {"status": "awaiting_destination"}

    # ---- Destination input ----
    if username in AWAITING_DESTINATION:

        if payload.latitude is None or payload.longitude is None:
            send_message(username, "Please share your live location.")
            return {"status": "missing_location"}

        dest = llm_extract_destination(payload.message)

        start = {"lat": payload.latitude, "lng": payload.longitude}
        journey_id = str(uuid.uuid4())

        endpoint = find_nearest_metro_or_direct(start, dest)

        uses_metro = endpoint != dest

        insert_journey_details({
            "username": username,
            "journey_id": journey_id,
            "start_lat": start["lat"],
            "start_lng": start["lng"],
            "end_lat": endpoint["lat"],
            "end_lng": endpoint["lng"],
            "state": StateEnum.START.value,
        })

        JOURNEY_CONTEXT[journey_id] = {
            "username": username,
            "start": start,
            "destination": dest,
            "endpoint": endpoint,
            "uses_metro": uses_metro,
            "state": StateEnum.START
        }

        ride = booking_agent_request(start, endpoint)

        send_message(
            username,
            f"Ride found to {endpoint['name']}.\n"
            f"Driver {ride['driver']} arriving in {ride['eta']}.\n"
            "Reply YES to confirm."
        )

        AWAITING_DESTINATION.remove(username)
        return {"journey_id": journey_id}

    # ---- Continue journey ----
    for jid, ctx in list(JOURNEY_CONTEXT.items()):
        if ctx["username"] != username:
            continue

        if ctx["state"] == StateEnum.START and message == "yes":

            confirm_booking(jid)
            set_state(jid, username, StateEnum.INTRANSIT1,
                      "Ride confirmed. Heading to metro.")

            listen_live_tracking(jid)

            if ctx["uses_metro"]:
                set_state(jid, username, StateEnum.MID,
                          "Reached metro station.")

                qr = generate_qr(get_metro_ticket("A", "B"))
                send_message(username, f"Metro Ticket:\n{qr}")

                ctx["state"] = StateEnum.MID
                return {"status": "metro_phase"}

            else:
                set_state(jid, username, StateEnum.END,
                          "You reached destination. Thank you!")
                JOURNEY_CONTEXT.pop(jid)
                return {"status": "completed"}

        if ctx["state"] == StateEnum.MID:

            ride = booking_agent_request(
                ctx["endpoint"], ctx["destination"]
            )

            set_state(jid, username, StateEnum.INTRANSIT2,
                      "Final ride started.")

            listen_live_tracking(jid)

            set_state(jid, username, StateEnum.END,
                      "Journey completed. Thank you for using RoadChal!")

            JOURNEY_CONTEXT.pop(jid)
            return {"status": "completed"}

    send_message(username, "Say HI to begin.")
    return {"status": "idle"}
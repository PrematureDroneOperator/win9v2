import os
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

UBER_TOKEN = os.getenv("UBER_SERVER_TOKEN")
OLA_KEY = os.getenv("OLA_API_KEY")

class Location(BaseModel):
    lat: float
    lng: float

class DriverDetails(BaseModel):
    name: str
    rating: float
    vehicle: str
    plate_number: str
    experience: str
    phone: str
    location: Location

class RideEstimate(BaseModel):
    ride_id: str
    service_provider: str # "Uber" or "Ola"
    category: str # "Mini", "Sedan", "Prime", etc.
    price: str
    eta: str
    distance: str

def get_mock_estimates(source: str, destination: str) -> List[RideEstimate]:
    """
    Returns mock ride estimates for Uber and Ola.
    Uses credentials: UBER_TOKEN, OLA_KEY
    """
    print(f"Fetching estimates using UBER_TOKEN: {UBER_TOKEN[:5]}... and OLA_KEY: {OLA_KEY[:5]}...")
    return [
        RideEstimate(
            ride_id="uber_123",
            service_provider="Uber",
            category="UberGo",
            price="₹150",
            eta="5 min",
            distance="4.2 km"
        ),
        RideEstimate(
            ride_id="ola_456",
            service_provider="Ola",
            category="Mini",
            price="₹145",
            eta="8 min",
            distance="4.2 km"
        ),
        RideEstimate(
            ride_id="uber_789",
            service_provider="Uber",
            category="Premier",
            price="₹210",
            eta="4 min",
            distance="4.2 km"
        )
    ]

def get_mock_driver_details(ride_id: str) -> DriverDetails:
    """
    Returns mock driver details based on the ride_id.
    Uses credentials: UBER_TOKEN, OLA_KEY
    """
    print(f"Fetching details for {ride_id} using token auth...")
    if "uber" in ride_id.lower():
        return DriverDetails(
            name="Rajesh Kumar",
            rating=4.9,
            vehicle="Honda City",
            plate_number="MH 12 AB 1234",
            experience="5 years",
            phone="+91 98765 43210",
            location=Location(lat=18.5104, lng=73.8467)
        )
    else:
        return DriverDetails(
            name="Suresh Patil",
            rating=4.7,
            vehicle="Maruti Swift",
            plate_number="MH 14 CD 5678",
            experience="3 years",
            phone="+91 91234 56789",
            location=Location(lat=18.5204, lng=73.8567)
        )

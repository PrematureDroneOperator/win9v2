# Backend/routes/rides_route.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

try:
    from ..controllers.rides_controller import get_mock_estimates, get_mock_driver_details, RideEstimate, DriverDetails
except ImportError:
    from controllers.rides_controller import get_mock_estimates, get_mock_driver_details, RideEstimate, DriverDetails

router = APIRouter()

class EstimateRequest(BaseModel):
    source: str
    destination: str

@router.post("/rides/estimates", response_model=List[RideEstimate])
async def rides_estimates(request: EstimateRequest):
    return get_mock_estimates(request.source, request.destination)

@router.get("/rides/driver/{ride_id}", response_model=DriverDetails)
async def ride_driver_details(ride_id: str):
    try:
        return get_mock_driver_details(ride_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Ride or driver not found")

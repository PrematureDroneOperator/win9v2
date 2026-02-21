# Backend/routes/tracking_routes.py
from fastapi import APIRouter

try:
    from ..controllers.tracking_controller import get_gmap_tracking_data
except ImportError:
    from controllers.tracking_controller import get_gmap_tracking_data

router = APIRouter()

@router.get("/tracking/map-data")
async def tracking_map_data():
    data = get_gmap_tracking_data()
    return data

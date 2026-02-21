# Backend/controllers/tracking_controller.py

def get_gmap_tracking_data():
    """
    Returns mock tracking data for Google Maps integration.
    In a real scenario, this would call Google Maps API (Distance Matrix, Directions, etc.)
    """
    return {
        "eta": "15 min",
        "distance": "4.5 km",
        "driver_location": {"lat": 18.5204, "lng": 73.8567},
        "status": "On time",
        "route_polyline": "..." # This could be encoded polyline from GMap API
    }

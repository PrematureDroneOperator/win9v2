import httpx
import asyncio
import json
from components.dhelper import haversine

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


async def find_nearest_metro(start, end):
    """
    start = {"lat": float, "lng": float}
    end   = {"lat": float, "lng": float}
    """

    query = f"""
    [out:json];
    (
      node["railway"="station"]["station"="subway"](around:5000,{start['lat']},{start['lng']});
      node["railway"="halt"]["station"="subway"](around:5000,{start['lat']},{start['lng']});
      node["public_transport"="station"](around:5000,{start['lat']},{start['lng']});
    );
    out body;
    """

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            res = await client.post(OVERPASS_URL, data={"data": query})
            res.raise_for_status()
            data = res.json()
        except (httpx.HTTPError, json.JSONDecodeError):
            return end

    if not data.get("elements"):
        # fallback → direct destination
        return end

    closest = None
    best_distance = float("inf")

    for station in data["elements"]:
        lat = station["lat"]
        lng = station["lon"]

        dist = haversine(
            start["lat"], start["lng"],
            lat, lng
        )

        if dist < best_distance:
            best_distance = dist
            closest = {
                "name": station.get("tags", {}).get("name", "Metro Station"),
                "lat": lat,
                "lng": lng
            }

    # compare with direct destination distance
    direct_distance = haversine(
        start["lat"], start["lng"],
        end["lat"], end["lng"]
    )

    if direct_distance <= best_distance:
        return end

    return closest

print(asyncio.run(find_nearest_metro(
    {"lat": 40.7128, "lng": -74.0060},
    {"lat": 40.730610, "lng": -73.935242}
)))

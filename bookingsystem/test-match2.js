import mongoose from "mongoose";
import DriverLocation from "./app/models/driver.location.model.js";

mongoose.connect("mongodb://localhost:27017/roadchal_db").then(async () => {
    // 18.5135, 73.8406 = Driver 
    // 18.5104, 73.8467 = Passenger Default 
    const lng = 73.8467;
    const lat = 18.5104;

    const nearbyDrivers = await DriverLocation.find({
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: 5000 // 5km radius
            }
        },
        status: "available"
    });
    
    console.log(`Found ${nearbyDrivers.length} drivers near passenger (${lat}, ${lng})`);
    process.exit(0);
});

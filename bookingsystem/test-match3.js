import mongoose from "mongoose";
import { io } from "socket.io-client";

const run = async () => {
    // 1. Connect a driver
    const driverSocket = io("http://localhost:8080", { auth: { token: "driver_token" }, transports: ['websocket'] });
    const driverId = new mongoose.Types.ObjectId().toString(); // Random new ID
    
    driverSocket.on("connect", () => {
        console.log("Driver Connected");
        driverSocket.emit("driverOnline", driverId);
        
        setTimeout(() => {
            driverSocket.emit("driverLocationUpdate", {
                driverId: driverId,
                lat: 18.5135, // Garware College Pune
                lon: 73.8406,
                status: "available"
            });
            console.log("Driver pushed location");
        }, 500);
    });

    driverSocket.on("newRideRequest", (req) => {
        console.log("SUCCESS! Driver received request:", req.bookingId);
        driverSocket.disconnect();
        process.exit(0);
    });

    // 2. Connect a passenger after a short delay
    setTimeout(() => {
        const passSocket = io("http://localhost:8080", { auth: { token: "user_token" }, transports: ['websocket'] });
        passSocket.on("connect", () => {
             console.log("Passenger Connected, requesting ride...");
             passSocket.emit("joinBookingRoom", { bookingId: "TEST-123" });
             passSocket.emit("requestRide", {
                 bookingId: "TEST-123",
                 userId: "some_user",
                 pickupLat: 18.5104, // Nal stop (approx 1km away)
                 pickupLng: 73.8467,
                 dropLat: 18.5200,
                 dropLng: 73.8500,
                 pickupAddress: "Pickup",
                 dropAddress: "Drop"
             });
        });
        
        passSocket.on("searchingDrivers", data => console.log("Pass: Searching...", data));
        passSocket.on("noDriversFound", () => {
            console.log("FAILURE: Passenger found 0 drivers");
            driverSocket.disconnect();
            passSocket.disconnect();
            process.exit(1);
        });

    }, 2000);
};

run();

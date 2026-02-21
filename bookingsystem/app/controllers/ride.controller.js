import Booking from "../models/booking.model.js";
import DriverLocation from "../models/driver.location.model.js";

export const bookRide = async (req, res) => {
    try {
        const { userId, pickupLocation, dropLocation, pickupDate, pickupTime } = req.body;

        if (!userId || !pickupLocation?.coordinates || !dropLocation?.coordinates) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // ✅ Find nearest available driver
        const nearestDriver = await DriverLocation.findOne({
            status: "available",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: pickupLocation.coordinates
                    },
                    $maxDistance: 5000 // 5km radius
                }
            }
        });

        if (!nearestDriver) {
            return res.status(404).json({ message: "No drivers available nearby" });
        }

        // ✅ Create booking with driver assigned
        const newBooking = new Booking({
            userId,
            driverId: nearestDriver.driver,
            pickupLocation,
            dropLocation,
            pickupDate,
            pickupTime,
            status: "assigned"
        });

        await newBooking.save();

        // Mark driver unavailable
        nearestDriver.status="on_trip";
        await nearestDriver.save();

        return res.status(201).json({
            message: "Ride booked & driver assigned",
            booking: newBooking
        });

    } catch (error) {
        console.error("Error booking ride:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
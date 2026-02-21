import mongoose from "mongoose";
import Driverlocation from "../models/driver.location.model.js";
import Driver from "../models/driver.model.js";
import UserLocation from "../models/user.location.model.js";
import Booking from "../models/booking.model.js";

export default function setupSocketEvents(io) {
    io.on("connection", (socket) => {
        //check for the driver connection 
        console.log("New client connected: " + socket.id);
        //for checking the driver online or not
        socket.on("driverOnline", async (driverId) => {
            try {
                console.log(`Driver ${driverId} is online`);
                await Driverlocation.findOneAndUpdate(
                    { driver: driverId },
                    {
                        $set: {
                            status: "available",
                            socketId: socket.id,
                        },
                    },
                    { upsert: true, new: true }
                );
                socket.join(`driver_${driverId}`);
            } catch (error) {
                console.error("Error updating driver location:", error);
            }

        });
        //if the drive is offline or disconnecting from the server
        socket.on("driveOffline", async (driverId) => {
            try {
                console.log(`Driver ${driverId} is offline`);
                await Driverlocation.findOneAndUpdate(
                    { driver: new mongoose.Types.ObjectId(driverId) },
                    {
                        status: "offline",
                        socketId: null
                    },
                    { new: true }
                );
                socket.leave(`driver_${driverId}`);
            } catch (error) {
                console.error("Error updating driver location:", error);
            }
        })
        //updatinging the driver location in the database
        socket.on("driverLocationUpdate", async (data) => {
            try {
                // Modified to also accept bookingId to stream to a specific user during a ride
                const { driverId, lat, lon, bookingId } = data;

                // 1️⃣ Basic validation
                if (!driverId || typeof lat !== "number" || typeof lon !== "number") {
                    return socket.emit("error", { message: "Invalid location data" });
                }

                // 2️⃣ Update driver location
                const updatedDriver = await Driverlocation.findOneAndUpdate(
                    { driver: driverId },
                    {
                        $set: {
                            location: {
                                type: "Point",
                                coordinates: [lon, lat], // GeoJSON format
                            },
                            status: "available",
                            socketId: socket.id,
                            timestamp: new Date(),
                        },
                    },
                    { upsert: true, new: true }
                );

                console.log("Driver location updated:", updatedDriver._id);

                // 3️⃣ If driver is on a ride, broadcast to the booking room for live tracking
                if (bookingId) {
                    io.to(`booking_${bookingId}`).emit("driverLocationUpdate", {
                        driverId,
                        lat,
                        lon
                    });
                }

            } catch (error) {
                console.error("Error updating driver location:", error);
            }
        });
        //socket on disconnecting
        socket.on("disconnect", async () => {
            try {
                console.log("Client disconnected: " + socket.id);
                await Driverlocation.findOneAndUpdate(
                    { socketId: socket.id },
                    {
                        status: "offline",
                        socketId: null
                    },
                    { new: true }
                );
            } catch (error) {
                console.error("Error updating driver location on disconnect:", error);
            }
        });
    });
}
//user socket


export function setupUserSocketEvents(io) {
    io.on("connection", (socket) => {
        console.log("New user connected: " + socket.id);

        //  USER ONLINE → join personal room
        socket.on("userOnline", async (userId) => {
            try {
                console.log(`User ${userId} is online`);

                await UserLocation.findOneAndUpdate(
                    { user: new mongoose.Types.ObjectId(userId) },
                    {
                        status: "Reached",
                        socketId: socket.id
                    },
                    { upsert: true, new: true }
                );

                // Join user-specific room
                socket.join(`user_${userId}`);

            } catch (error) {
                console.error("Error setting user online:", error);
            }
        });

        //  USER LOCATION UPDATE (for live tracking)
        socket.on("userLocationUpdate", async (data) => {
            try {
                const { userId, lat, lon } = data;

                if (!userId || typeof lat !== "number" || typeof lon !== "number") {
                    return socket.emit("error", { message: "Invalid user location data" });
                }

                const updatedUser = await UserLocation.findOneAndUpdate(
                    { user: userId },
                    {
                        $set: {
                            location: {
                                type: "Point",
                                coordinates: [lon, lat],
                            },
                            socketId: socket.id,
                            timestamp: new Date(),
                        },
                    },
                    { upsert: true, new: true }
                );

                console.log("User location updated:", updatedUser._id);

            } catch (error) {
                console.error("Error updating user location:", error);
            }
        });
        //user request for the ride
        socket.on("requestRide", async ({ bookingId, userId, pickupLat, pickupLng, dropLat, dropLng, pickupAddress, dropAddress }) => {
            try {
                console.log(`User ${userId} requested ride for booking ${bookingId}`);

                let lat = pickupLat;
                let lng = pickupLng;

                if (!lat || !lng) {
                    const userLoc = await UserLocation.findOne({ user: userId });
                    if (userLoc && userLoc.location && userLoc.location.coordinates) {
                        lng = userLoc.location.coordinates[0];
                        lat = userLoc.location.coordinates[1];
                    } else {
                        // fallback coordinates if missing
                        lng = 73.8467;
                        lat = 18.5104;
                    }
                }

                // Query for drivers within a 5km radius who are available
                const nearbyDrivers = await Driverlocation.find({
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

                console.log(`Found ${nearbyDrivers.length} drivers near user ${userId}`);

                if (nearbyDrivers.length > 0) {
                    nearbyDrivers.forEach(driverLoc => {
                        const driverIdStr = driverLoc.driver.toString();
                        // Notify the specific driver socket room
                        io.to(`driver_${driverIdStr}`).emit("newRideRequest", {
                            bookingId,
                            userId,
                            pickupLat: lat,
                            pickupLng: lng,
                            dropLat,
                            dropLng,
                            pickupAddress,
                            dropAddress
                        });
                    });
                } else {
                    io.to(`booking_${bookingId}`).emit("noDriversFound", { bookingId });
                }

                // Notify user room that searching started
                io.to(`booking_${bookingId}`).emit("searchingDrivers", { bookingId, count: nearbyDrivers.length });

            } catch (error) {
                console.error("Error handling ride request:", error);
            }
        });
        //when the driver accepts the ride request
        socket.on("acceptRide", async ({ bookingId, driverId, pickupLat, pickupLng, dropLat, dropLng, pickupAddress, dropAddress, userId }) => {
            try {
                console.log(`Driver ${driverId} accepted ride for booking ${bookingId}`);

                // Fetch the actual Driver details to show to the user
                let driverDetails = null;
                try {
                    driverDetails = await Driver.findById(driverId).select('-password');
                } catch (err) {
                    console.error("Error fetching driver details:", err);
                }

                // Save the ride to the database so it appears in history
                try {
                    const newBooking = new Booking({
                        orderNumber: bookingId,
                        driverId: driverId,
                        userId: userId || "user",
                        pickupLocation: [pickupLng, pickupLat],
                        dropLocation: [dropLng, dropLat],
                        pickupDate: new Date(),
                        pickupTime: new Date(),
                        status: "accepted"
                    });

                    // We can optionally store string addresses by adding them to the schema, 
                    // but coordinates are required by the schema.
                    await newBooking.save();
                    console.log(`Ride ${bookingId} saved to database for driver history.`);
                } catch (dbErr) {
                    console.error("Error saving booking to DB:", dbErr);
                }

                // Notify user about ride acceptance with driver payload
                io.to(`booking_${bookingId}`).emit("rideAccepted", { bookingId, driverId, driverDetails });
            } catch (error) {
                console.error("Error handling ride acceptance:", error);
            }
        });

        // Driver completes the ride
        socket.on("completeRide", async ({ bookingId, driverId }) => {
            try {
                console.log(`Driver ${driverId} completed ride ${bookingId}`);
                await Booking.findOneAndUpdate(
                    { orderNumber: bookingId },
                    { status: "completed" }
                );
                console.log(`Ride ${bookingId} marked as completed in database.`);
                io.to(`booking_${bookingId}`).emit("rideCompleted", { bookingId });
            } catch (error) {
                console.error("Error completing ride:", error);
            }
        });

        //  USER JOINS BOOKING ROOM (for ride updates)
        socket.on("joinBookingRoom", ({ bookingId }) => {
            socket.join(`booking_${bookingId}`);
            console.log(`User joined booking room booking_${bookingId}`);
        });

        //  USER DISCONNECT
        socket.on("disconnect", async () => {
            try {
                console.log("User disconnected: " + socket.id);

                await UserLocation.findOneAndUpdate(
                    { socketId: socket.id },
                    {
                        status: "offline",
                        socketId: null
                    },
                    { new: true }
                );

            } catch (error) {
                console.error("Error updating user on disconnect:", error);
            }
        });
    });
}
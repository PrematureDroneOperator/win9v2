import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    userId: {
        type: String,
        required: true,
    },
    pickupLocation: {
         type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0]
    },
    dropLocation: {
         type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0]
    },
    pickupDate: {
        type: Date,
        required: true
    },
    pickupTime: {
        type: Date,
        required: true
    },
    status: {
        enum: ["pending", "accepted", "in_progress", "completed", "cancelled"],
        type: String,
        default: "pending",
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        trim: true,
        lowercase: true
    },
    vehicleNumber: {
        type: String,
        trim: true,
    },
    vehicleType: {
        enum:["car","biketaxi","auto","shuttle"],
        type: String,
        trim: true,
    },
    vehicleModel: {
        type: String,
        trim: true,
    },
    Rating: {
        type: Number,
        default: 0
    },
    isOnBoarded:{
        type: Boolean,
        default: false
    }
});

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;

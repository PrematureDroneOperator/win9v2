import mongoose from "mongoose";
export const UserLocationSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
        unique:true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0]
        }
    },
    status:{
        type:String,
        enum:["online", "Reached", "offline"],
        default:"offline"   

    }   
    ,
    socketId: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
UserLocationSchema.index({ location: "2dsphere" });
const UserLocation = mongoose.model("UserLocation", UserLocationSchema);
export default UserLocation;
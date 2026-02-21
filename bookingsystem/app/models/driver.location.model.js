import mongoose from "mongoose";

const driverLocationSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      unique: true // One live location per driver
    },

    status: {
      type: String,
      enum: ["offline", "available", "on_trip"],
      default: "offline"
    },

    socketId: {
      type: String,
      default: null
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// 🔥 Geo index
driverLocationSchema.index({ location: "2dsphere" });

// 🔥 Auto update timestamp on location change
driverLocationSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

const DriverLocation = mongoose.model("DriverLocation", driverLocationSchema);

export default DriverLocation;
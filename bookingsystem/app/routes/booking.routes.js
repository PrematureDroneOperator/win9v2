import express from "express";
import { requestRide, getPendingRides, acceptRide, updateRideStatus, getDriverRidesHistory, getUserRidesHistory } from "../controllers/booking.controller.js";
import { verifySupabaseUser, verifyDriver } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Routes
// POST /api/bookings/request (Requires Supabase JWT)
router.post("/request", verifySupabaseUser, requestRide);

// GET /api/bookings/user/history (Requires Supabase JWT)
router.get("/user/history", verifySupabaseUser, getUserRidesHistory);

// Driver Routes
// GET /api/bookings/pending (Requires Driver JWT)
router.get("/pending", verifyDriver, getPendingRides);

// GET /api/bookings/driver/history (Requires Driver JWT)
router.get("/driver/history", verifyDriver, getDriverRidesHistory);

// PUT /api/bookings/:bookingId/accept (Requires Driver JWT)
router.put("/:bookingId/accept", verifyDriver, acceptRide);

// PUT /api/bookings/:bookingId/status (Requires Driver JWT)
router.put("/:bookingId/status", verifyDriver, updateRideStatus);

export default router;

import express from "express";
import { registerDriver, loginDriver, getDriverProfile, onboardDriver, setDriverAvailability, toggleDriverAvailability, logoutDriver } from "../controllers/driver.controller.js";
import { verifyDriver } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/drivers/register
router.post("/register", registerDriver);

// POST /api/drivers/login
router.post("/login", loginDriver);

// GET /api/drivers/profile (Protected Route)
router.get("/profile", verifyDriver, getDriverProfile);

//POST /api/drivers/onboard (Protected Route)
router.post("/onboard", verifyDriver, onboardDriver);

// PUT /api/drivers/availability (Protected Route)
router.put("/availability", verifyDriver, setDriverAvailability);

// PUT /api/drivers/toggle-availability (Protected Route)
router.put("/toggle-availability", verifyDriver, toggleDriverAvailability);

// POST /api/drivers/logout
router.post("/logout", logoutDriver);

export default router;

import Driver from "../models/driver.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

// Register new driver
export const registerDriver = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const data = { firstname, lastname, email, password }
        //checking for missing fields
        for (const key in data) {
            if (!data[key] || typeof data[key] !== "string" || !data[key].trim()) {
                return res.status(400).json({ message: `${key} is required` });
            }
        }
        // Check if driver exists
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ message: "Driver with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create driver
        const driver = new Driver({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        await driver.save();
        // Create JWT payload
        const payload = {
            id: driver._id,
            email: driver.email,
            role: "driver"
        };

        // Sign token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        //setting the cookie
        res.cookie("authToken", token);
        res.status(201).json({ message: "Driver registered successfully" });
    } catch (error) {
        console.error("Error registering driver:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};
// Login driver
export const loginDriver = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for driver
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        console.log(password, driver.password) // Debugging line to check the values being compared
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT payload
        const payload = {
            id: driver._id,
            email: driver.email,
            role: "driver"
        };

        // Sign token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
        res.cookie("authToken", token);
        res.json({
            message: "Login successful",
            token,
            driver: {
                id: driver._id,
                name: `${driver.firstname} ${driver.lastname}`,
                firstname: driver.firstname,
                lastname: driver.lastname,
                email: driver.email,
                Rating: driver.Rating,
                rating: driver.Rating
            }
        });
    } catch (error) {
        console.error("Error logging in driver:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
//Onboarding driver
export const onboardDriver = async (req, res) => {
    try {
        const driverPayload = req.user
        const driverId = driverPayload.id
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        if (driver.isOnBoarded) {
            return res.status(400).json({ message: "Driver is already onboarded" });
        }

        const { phone, address, vehicleNumber, vehicleType, vehicleModel } = req.body;
        const allowedVehicleTypes = ["car", "biketaxi", "auto", "shuttle"];
        if (!allowedVehicleTypes.includes(vehicleType)) {
            return res.status(400).json({ message: "Invalid vehicle type" });
        }
        //checking for missing fields
        const data = { phone, address, vehicleNumber, vehicleType, vehicleModel }
        for (const key in data) {
            if (!data[key] || typeof data[key] !== "string" || !data[key].trim()) {
                return res.status(400).json({ message: `${key} is required` });
            }
        }
        driver.phone = phone;
        driver.address = address;
        driver.vehicleNumber = vehicleNumber;
        driver.vehicleType = vehicleType;
        driver.vehicleModel = vehicleModel;
        driver.isOnBoarded = true
        await driver.save();
        res.json({ message: "Driver onboarded successfully" });
    }
    catch (error) {
        console.error("Error onboarding driver:", error);
        res.status(500).json({ message: "Server error during onboarding" });
    }
};


// Get current driver profile
export const getDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findById(req.user.id).select("-password");
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.json(driver);
    } catch (error) {
        console.error("Error fetching driver profile:", error);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};
//make the driver available for rides
export const setDriverAvailability = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["offline", "available"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const driver = await Driver.findById(req.user.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        driver.status = status;
        await driver.save();
        res.json({ message: `Driver status updated to ${status}` });
    } catch (error) {
        console.error("Error updating driver availability:", error);
        res.status(500).json({ message: "Server error updating availability" });
    }
}

//toggle driver availability
export const toggleDriverAvailability = async (req, res) => {
    try {
        const driver = await Driver.findById(req.user.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        driver.status = driver.status === "available" ? "offline" : "available";
        await driver.save();
        res.json({ message: `Driver status toggled to ${driver.status}` });
    } catch (error) {
        console.error("Error toggling driver availability:", error);
        res.status(500).json({ message: "Server error toggling availability" });
    }
}

//Driver logout
export const logoutDriver = (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logout successful" });
};


//these would be used in socket events
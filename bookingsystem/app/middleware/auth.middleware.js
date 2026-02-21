import jwt from "jsonwebtoken";
import supabase from "../config/supabase.config.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_in_production";

// Middleware to verify Driver JWT (Backend-issued)
export const verifyDriver = (req, res, next) => {
    try {
        const token = req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No driver token, authorization denied" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded)
        if (decoded.role !== "driver") {
            return res.status(403).json({ message: "Access denied. Not a driver." });
        }

        req.user = decoded; // Contains id and role
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Middleware to verify Supabase JWT (User Auth)
export const verifySupabaseUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No user token, authorization denied" });
        }

        // Verify the token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: "Invalid user token", error: error?.message });
        }

        // Attach user info to request
        req.user = {
            id: user.id,
            email: user.email,
            role: "user"
        };

        next();
    } catch (error) {
        console.error("Supabase auth error:", error);
        res.status(500).json({ message: "Server error during authentication" });
    }
};

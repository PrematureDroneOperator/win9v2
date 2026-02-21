import express from "express";
import cors from "cors";
import setupSocketEvents, { setupUserSocketEvents } from "./app/events/socket.events.js";
import dotenv from "dotenv";
import connectDB from "./app/config/db.config.js";
import bookingRoutes from "./app/routes/booking.routes.js";
import driverRoutes from "./app/routes/driver.routes.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
dotenv.config();

// Connect to database
connectDB().catch(() => {
    console.log("there was an error while connecting to the database");
    process.exit(1)
});

const app = express();
const server = http.createServer(app);
//for the sokcet server 
export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
        withCredentials: true,
    },
});

setupSocketEvents(io);
setupUserSocketEvents(io);
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple welcome route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to RoadChal Booking System API." });
});

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/drivers", driverRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

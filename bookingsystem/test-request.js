import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  auth: { token: "user_dummy" }
});

socket.on("connect", () => {
  console.log("User connected:", socket.id);
  const bookingId = "ORD-TEST-123";
  
  // Listen for drivers
  socket.on("searchingDrivers", (data) => console.log("Searching...", data));
  socket.on("noDriversFound", () => console.log("No drivers found!"));
  socket.on("error", (err) => console.log("Error:", err));

  socket.emit("joinBookingRoom", { bookingId });
  
  // Request ride near Garware College (18.5135, 73.8406) - driver should be right there
  socket.emit("requestRide", {
      bookingId,
      userId: "user_123",
      pickupLat: 18.5130, 
      pickupLng: 73.8400,
      dropLat: 18.5200,
      dropLng: 73.8500,
      pickupAddress: "Mock User Pickup",
      dropAddress: "Mock User Drop"
  });

  setTimeout(() => {
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

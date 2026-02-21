import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  auth: { token: "dummy" }
});

socket.on("connect", () => {
  console.log("Connected to backend!", socket.id);
  // Simulate Driver online
  const driverId = "60c72b2f9b1d8b001c8e4a7a"; // Dummy MongoId
  socket.emit("driverOnline", driverId);
  
  // Simulate location update
  socket.emit("driverLocationUpdate", {
      driverId: driverId,
      lat: 18.5135, // Garware College Pune
      lon: 73.8406,
      status: "available"
  });

  setTimeout(() => {
    socket.emit("driveOffline", driverId);
    socket.disconnect();
    process.exit(0);
  }, 2000);
});

socket.on("connect_error", (err) => console.log("Conn Error:", err.message));

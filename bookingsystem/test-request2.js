import { io } from "socket.io-client";

// Simulate Passenger App Request
const passengerSocket = io("http://localhost:8080", {
  transports: ["websocket", "polling"],
  withCredentials: true
});

passengerSocket.on("connect", () => {
  console.log("Passenger connected:", passengerSocket.id);
  const bookingId = "ORD-" + Date.now();
  
  passengerSocket.emit("joinBookingRoom", { bookingId });
  passengerSocket.on("searchingDrivers", (data) => console.log("Passenger: Searching...", data));
  passengerSocket.on("noDriversFound", () => console.log("Passenger: No drivers found!"));
  passengerSocket.on("error", (e) => console.error("Passenger error", e));
  
  passengerSocket.emit("requestRide", {
      bookingId,
      userId: "user_test_999",
      pickupLat: 18.5104,
      pickupLng: 73.8467,
      dropLat: 18.5200,
      dropLng: 73.8500,
      pickupAddress: "Kothrud, Pune",
      dropAddress: "Pune Station"
  });

  setTimeout(() => {
    passengerSocket.disconnect();
    process.exit(0);
  }, 3000);
});

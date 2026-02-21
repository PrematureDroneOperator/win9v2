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
  passengerSocket.on("rideAccepted", (d) => {
     console.log("Passenger ride accepted with Details:", JSON.stringify(d, null, 2));
     passengerSocket.disconnect();
     process.exit(0);
  });
  
  passengerSocket.emit("requestRide", {
      bookingId,
      userId: "user_test_999",
      pickupLat: 18.5135,
      pickupLng: 73.8406,
      dropLat: 18.5200,
      dropLng: 73.8500,
      pickupAddress: "Kothrud, Pune",
      dropAddress: "Pune Station"
  });

  setTimeout(() => {
    console.log("Mock timeout, please ensure a driver is 'Available' on localhost:5173 to catch this request...");
    passengerSocket.disconnect();
    process.exit(0);
  }, 10000); 
});

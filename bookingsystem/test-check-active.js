import mongoose from "mongoose";
import DriverLocation from "./app/models/driver.location.model.js";

mongoose.connect("mongodb://localhost:27017/roadchal_db").then(async () => {
  const active = await DriverLocation.find({ status: "available" });
  console.log("Active drivers found:", active.length);
  active.forEach(d => console.log(d.driver, d.location.coordinates));
  process.exit(0);
});

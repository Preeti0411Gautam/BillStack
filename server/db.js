import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MongoDB URI is not defined in the environment variables.");
  process.exit(1); // Exit the process if the URI is missing
}

console.log("Connecting to MongoDB...");

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if connection fails
  });

// Optional: Add Mongoose event listeners for debugging
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database.");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected.");
});

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to application termination.");
  process.exit(0);
});

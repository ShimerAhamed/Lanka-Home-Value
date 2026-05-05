const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const predictionRoutes = require("./routes/predictionRoutes");

// Load variables from the .env file.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lankahomevalue";

// Allow requests from the React frontend.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Connect Express backend to MongoDB using mongoose.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed");
    console.error("Please make sure MongoDB is running.");
    console.error(error.message);
  });

// Simple test route.
app.get("/", (req, res) => {
  res.json({
    message: "LankaHomeValue Express backend is running",
  });
});

// Prediction routes.
app.use("/api", predictionRoutes);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start the server on http://localhost:5000.
app.listen(PORT, () => {
  console.log(`LankaHomeValue Express backend running on http://localhost:${PORT}`);
});

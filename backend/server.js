const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load variables from the .env file.
dotenv.config();

const predictionRoutes = require("./routes/predictionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lankahomevalue";
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

// Allow requests from the React frontend during development.
app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Allow Express to read JSON request bodies.
app.use(express.json({ limit: "1mb" }));

// Return a beginner-friendly message when invalid JSON is sent.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON. Please check the request body.",
    });
  }

  return next(error);
});

// Connect Express backend to MongoDB using mongoose.
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
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

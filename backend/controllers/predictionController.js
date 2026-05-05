const axios = require("axios");
const mongoose = require("mongoose");

const Prediction = require("../models/Prediction");

const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "http://127.0.0.1:8000/predict";
const PYTHON_HEALTH_URL = PYTHON_API_URL.replace(/\/predict\/?$/, "/health");

function isMongoConnected() {
  // 1 means mongoose is connected to MongoDB.
  return mongoose.connection.readyState === 1;
}

// GET /api/health
// Checks whether the Express backend, FastAPI service, and MongoDB are available.
const getSystemHealth = async (req, res) => {
  let pythonApiStatus = "not connected";

  try {
    const pythonResponse = await axios.get(PYTHON_HEALTH_URL, {
      timeout: 5000,
    });

    if (pythonResponse.data?.api === "running") {
      pythonApiStatus = "connected";
    }
  } catch (error) {
    pythonApiStatus = "not connected";
  }

  return res.status(200).json({
    backend: "running",
    pythonApi: pythonApiStatus,
    database: isMongoConnected() ? "connected" : "not connected",
  });
};

// POST /api/predict
// Receives house details from React, sends them to FastAPI, saves the result,
// then returns the prediction to the frontend.
const predictHousePrice = async (req, res) => {
  try {
    const inputData = req.body;

    if (
      !inputData ||
      typeof inputData !== "object" ||
      Array.isArray(inputData) ||
      Object.keys(inputData).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Please send house details as a JSON object.",
      });
    }

    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected. Please start MongoDB first.",
      });
    }

    // Send the same JSON data to the Python FastAPI prediction API.
    const pythonResponse = await axios.post(PYTHON_API_URL, inputData, {
      timeout: 15000,
    });

    const predictionData = pythonResponse.data;

    if (
      predictionData.predicted_price_lkr === undefined ||
      !predictionData.price_category
    ) {
      return res.status(502).json({
        success: false,
        message: "Invalid response received from prediction service.",
      });
    }

    // Save the request and prediction result in MongoDB.
    await Prediction.create({
      inputData,
      predictedPriceLkr: predictionData.predicted_price_lkr,
      priceCategory: predictionData.price_category,
    });

    return res.status(200).json({
      success: true,
      message: "Prediction completed successfully",
      data: {
        predicted_price_lkr: predictionData.predicted_price_lkr,
        price_category: predictionData.price_category,
      },
    });
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.code === "ECONNABORTED") {
      return res.status(503).json({
        success: false,
        message: "Prediction service is not running. Please start FastAPI first.",
      });
    }

    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message:
          error.response.data?.detail ||
          "Prediction service returned an error.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong while completing the prediction.",
      error: error.message,
    });
  }
};

// GET /api/predictions
// Returns all saved prediction history records, latest first.
const getPredictionHistory = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected. Please start MongoDB first.",
      });
    }

    const predictions = await Prediction.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Prediction history loaded successfully",
      data: predictions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load prediction history.",
      error: error.message,
    });
  }
};

// DELETE /api/predictions/:id
// Deletes one prediction history record by MongoDB document id.
const deletePrediction = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected. Please start MongoDB first.",
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction id.",
      });
    }

    const deletedPrediction = await Prediction.findByIdAndDelete(id);

    if (!deletedPrediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction history record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prediction history record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete prediction history record.",
      error: error.message,
    });
  }
};

module.exports = {
  getSystemHealth,
  predictHousePrice,
  getPredictionHistory,
  deletePrediction,
};

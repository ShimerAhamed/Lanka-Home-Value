const express = require("express");

const {
  deletePrediction,
  getPredictionHistory,
  getSystemHealth,
  predictHousePrice,
} = require("../controllers/predictionController");

const router = express.Router();

// GET /api/health
router.get("/health", getSystemHealth);

// POST /api/predict
router.post("/predict", predictHousePrice);

// GET /api/predictions
router.get("/predictions", getPredictionHistory);

// DELETE /api/predictions/:id
router.delete("/predictions/:id", deletePrediction);

module.exports = router;

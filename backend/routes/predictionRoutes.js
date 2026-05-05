const express = require("express");

const {
  deletePrediction,
  getPredictionHistory,
  predictHousePrice,
} = require("../controllers/predictionController");

const router = express.Router();

// POST /api/predict
router.post("/predict", predictHousePrice);

// GET /api/predictions
router.get("/predictions", getPredictionHistory);

// DELETE /api/predictions/:id
router.delete("/predictions/:id", deletePrediction);

module.exports = router;

const mongoose = require("mongoose");

// This schema stores each prediction request and result in MongoDB.
const predictionSchema = new mongoose.Schema({
  inputData: {
    type: Object,
    required: true,
  },
  predictedPriceLkr: {
    type: Number,
    required: true,
  },
  priceCategory: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Prediction", predictionSchema);

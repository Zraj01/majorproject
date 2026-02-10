/**
 * Prediction model for storing analysis results
 */
const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    diseaseType: {
      type: String,
      enum: ['PNEUMONIA', 'TB'],
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ['Positive', 'Negative'],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Prediction', predictionSchema);

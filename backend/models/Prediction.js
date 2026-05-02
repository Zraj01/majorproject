
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
    urgencyLevel: {
      type: String,
      default: "",
    },
    whatToDoNow: {
      type: [String],
      default: [],
    },
    warningSigns: {
      type: [String],
      default: [],
    },
    locationStatus: {
      type: String,
      default: "",
    },
    nearbyHospitals: {
      type: [{
        name: String,
        address: String,
        distance: String,
        contact: String,
      }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Prediction', predictionSchema);

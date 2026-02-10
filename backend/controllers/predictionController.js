
const path = require('path');
const Prediction = require('../models/Prediction');
const { runInference } = require('../utils/pythonService');


const createPrediction = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    const diseaseType = (req.body.diseaseType || '').toUpperCase();
    if (!['PNEUMONIA', 'TB'].includes(diseaseType)) {
      return res.status(400).json({ message: 'diseaseType must be PNEUMONIA or TB' });
    }

    const imagePath = path.join('uploads', req.file.filename);
    const inference = await runInference(diseaseType, imagePath);

    const prediction = await Prediction.create({
      userId: req.user._id,
      diseaseType,
      imagePath,
      result: inference.result,
      confidence: inference.confidence,
    });

    res.status(201).json({
      message: 'Analysis complete',
      prediction: {
        id: prediction._id,
        diseaseType: prediction.diseaseType,
        result: prediction.result,
        confidence: prediction.confidence,
        imagePath: prediction.imagePath,
        createdAt: prediction.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/predictions/:id - get single prediction (protected, own only)
 */
const getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id).populate('userId', 'name email');
    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }
    if (prediction.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this prediction' });
    }
    res.json({
      prediction: {
        id: prediction._id,
        diseaseType: prediction.diseaseType,
        result: prediction.result,
        confidence: prediction.confidence,
        imagePath: prediction.imagePath,
        createdAt: prediction.createdAt,
        user: { email: prediction.userId.email, name: prediction.userId.name },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * GET /api/predictions - list user's predictions (protected)
 */
const getMyPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { createPrediction, getPrediction, getMyPredictions };

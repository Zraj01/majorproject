/**
 * Prediction routes: create (upload), get one, list mine
 */
const express = require('express');
const router = express.Router();
const { createPrediction, getPrediction, getMyPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);
router.post('/', upload.single('image'), createPrediction);
router.get('/', getMyPredictions);
router.get('/:id', getPrediction);

module.exports = router;

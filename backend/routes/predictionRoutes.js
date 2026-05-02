
const express = require('express');
const router = express.Router();
const { createPrediction, getPrediction, getMyPredictions, updateHospitals } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);
router.post('/', upload.single('image'), createPrediction);
router.get('/', getMyPredictions);
router.get('/:id', getPrediction);
router.post('/:id/hospitals', updateHospitals);

module.exports = router;

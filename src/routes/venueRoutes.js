const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.post('/', protect, venueController.createVenue);
router.put('/:id', protect, venueController.updateVenue);
router.delete('/:id', protect, venueController.deleteVenue);

module.exports = router;

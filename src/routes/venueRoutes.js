const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const venueController = require('../controllers/venueController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const venueRules = [
  body('name').trim().notEmpty().withMessage('Venue name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  body('price_per_hour').isFloat({ min: 0 }).withMessage('Price per hour must be a positive number'),
];

router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.post('/', protect, venueRules, validate, venueController.createVenue);
router.put('/:id', protect, venueRules, validate, venueController.updateVenue);
router.delete('/:id', protect, venueController.deleteVenue);

module.exports = router;

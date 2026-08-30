const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const bookingRules = [
  body('venue_id').isInt({ min: 1 }).withMessage('Valid venue ID is required'),
  body('event_date').isDate().withMessage('Valid event date is required'),
  body('start_time').notEmpty().withMessage('Start time is required'),
  body('end_time').notEmpty().withMessage('End time is required'),
  body('guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
];

const updateBookingRules = [
  body('event_date').isDate().withMessage('Valid event date is required'),
  body('start_time').notEmpty().withMessage('Start time is required'),
  body('end_time').notEmpty().withMessage('End time is required'),
  body('guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
];

router.get('/', protect, bookingController.getAllBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.post('/', protect, bookingRules, validate, bookingController.createBooking);
router.put('/:id', protect, updateBookingRules, validate, bookingController.updateBooking);
router.delete('/:id', protect, bookingController.deleteBooking);

module.exports = router;

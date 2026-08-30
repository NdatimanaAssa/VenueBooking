const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, bookingController.getAllBookings);
router.get('/:id', protect, bookingController.getBookingById);
router.post('/', protect, bookingController.createBooking);
router.put('/:id', protect, bookingController.updateBooking);
router.delete('/:id', protect, bookingController.deleteBooking);

module.exports = router;

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middlewares/authMiddleware');

// Private route to create a booking entry
router.post('/', verifyToken, bookingController.createBooking);

// Private route to get bookings belonging to the currently logged-in user
router.get('/', verifyToken, bookingController.getMyBookings);

// Private route to cancel a booking (Owner only)
router.patch('/:id/cancel', verifyToken, bookingController.cancelBooking);

module.exports = router;

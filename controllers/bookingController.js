const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Create a new booking entry (Private)
exports.createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, days, driverNeeded, specialNote, totalPrice } = req.body;

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: 'Car ID is required',
      });
    }

    // Verify car existence and availability
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    if (!car.available) {
      return res.status(400).json({
        success: false,
        message: 'This car is currently not available for booking',
      });
    }

    const durationDays = Number(days) || 1;
    const computedPrice = totalPrice || (car.dailyRent * durationDays);

    // Create the booking record
    const booking = await Booking.create({
      carId,
      userEmail: req.user.email.toLowerCase(),
      userId: req.user.id,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
      days: durationDays,
      totalPrice: computedPrice,
      driverNeeded: driverNeeded || false,
      specialNote: specialNote || '',
      status: 'Confirmed',
    });

    // Atomically increment booking count fields on the Car document and set its availability to false
    await Car.findByIdAndUpdate(
      carId,
      {
        $inc: { booking_count: 1, bookingCount: 1 },
        $set: { available: false }
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: error.message,
    });
  }
};

// Fetch bookings belonging only to the currently logged-in user (Private)
exports.getMyBookings = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();

    // Populate with Car details (Car Name, image, dailyRent, etc.)
    const bookings = await Booking.find({ userEmail })
      .populate({
        path: 'carId',
        select: 'name dailyRent image pickupLocation available',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving bookings',
      error: error.message,
    });
  }
};

// Cancel a booking (Private - User's own booking)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership of the booking
    if (booking.userEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to cancel this booking',
      });
    }

    // Update status to Cancelled
    booking.status = 'Cancelled';
    await booking.save();

    // Re-enable availability of the car
    await Car.findByIdAndUpdate(booking.carId, {
      $set: { available: true }
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking',
      error: error.message,
    });
  }
};

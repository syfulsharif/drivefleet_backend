const Car = require('../models/Car');

// Create a new car listing (Private)
exports.createCar = async (req, res) => {
  try {
    const { name, dailyRent, carType, image, seatCapacity, pickupLocation, description } = req.body;

    if (!name || !dailyRent || !carType || !image || !seatCapacity || !pickupLocation || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, dailyRent, carType, image, seatCapacity, pickupLocation, description) are required',
      });
    }

    const newCar = await Car.create({
      name,
      dailyRent,
      carType,
      image,
      seatCapacity,
      pickupLocation,
      description,
      ownerEmail: req.user.email.toLowerCase(),
      ownerId: req.user.id,
      available: true,
    });

    res.status(201).json({
      success: true,
      message: 'Car listed successfully',
      data: newCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while listing car',
      error: error.message,
    });
  }
};

// Get all car listings with Search & Filter (Public)
exports.getCars = async (req, res) => {
  try {
    const { search, carType, pickupLocation, available, minPrice, maxPrice } = req.query;

    const query = {};

    // Search by car name (partial match, case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by car type
    if (carType) {
      query.carType = { $regex: `^${carType}$`, $options: 'i' };
    }

    // Filter by pickup location
    if (pickupLocation) {
      query.pickupLocation = { $regex: pickupLocation, $options: 'i' };
    }

    // Filter by availability
    if (available !== undefined) {
      query.available = available === 'true';
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.dailyRent = {};
      if (minPrice) query.dailyRent.$gte = Number(minPrice);
      if (maxPrice) query.dailyRent.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cars',
      error: error.message,
    });
  }
};

// Get a single car by ID (Public)
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching car details',
      error: error.message,
    });
  }
};

// Update a car listing (Private - Owner only)
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    // Authorization: Enforce that only the creator of the listing can modify it
    if (car.ownerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to edit this listing',
      });
    }

    // Fields that are allowed to be updated
    const allowedFields = [
      'name',
      'dailyRent',
      'carType',
      'image',
      'seatCapacity',
      'pickupLocation',
      'description',
      'available',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        car[field] = req.body[field];
      }
    });

    const updatedCar = await car.save();

    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully',
      data: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating car listing',
      error: error.message,
    });
  }
};

// Delete a car listing (Private - Owner only)
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found',
      });
    }

    // Authorization: Enforce that only the creator of the listing can delete it
    if (car.ownerEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this listing',
      });
    }

    await car.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting car listing',
      error: error.message,
    });
  }
};

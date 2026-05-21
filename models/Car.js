const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    dailyRent: {
      type: Number,
      required: [true, 'Daily rent price is required'],
      min: [0, 'Daily rent price cannot be negative'],
    },
    carType: {
      type: String,
      required: [true, 'Car type is required'],
      enum: {
        values: ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Crossover', 'Convertible', 'Minivan', 'Coupe', 'Pickup', 'Electric'],
        message: '{VALUE} is not a valid car type',
      },
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    seatCapacity: {
      type: Number,
      required: [true, 'Seat capacity is required'],
      min: [1, 'Seat capacity must be at least 1'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
      lowercase: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    booking_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized searching and filtering
carSchema.index({ name: 'text', carType: 1 });

module.exports = mongoose.model('Car', carSchema);

const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const verifyToken = require('../middlewares/authMiddleware');

// Public route to get all listings with Search & Filter
router.get('/', carController.getCars);

// Public route to get a single car listing
router.get('/:id', carController.getCarById);

// Private route to create a new car listing
router.post('/', verifyToken, carController.createCar);

// Private route to update a car listing (Owner only)
router.patch('/:id', verifyToken, carController.updateCar);

// Private route to delete a car listing (Owner only)
router.delete('/:id', verifyToken, carController.deleteCar);

module.exports = router;

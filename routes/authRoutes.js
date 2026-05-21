const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration route
router.post('/register', authController.register);

// Standard Login route
router.post('/login', authController.login);

// POST /api/auth/jwt - Generate token on successful login/registration, set it in HTTPOnly cookie
router.post('/jwt', authController.generateJWT);

// POST /api/auth/logout - Clear HTTPOnly cookie
router.post('/logout', authController.logout);

module.exports = router;

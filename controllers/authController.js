const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign and set token in a cookie
const sendTokenCookie = (user, statusCode, res, message) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'yBkVfMXsM3g8aHbB',
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: true, // Always true to support SameSite=None in modern browsers
    sameSite: 'none',
  };

  res.cookie('token', token, cookieOptions);
  res.cookie('jwt', token, cookieOptions); // support both cookie names

  res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    },
    token,
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, photoUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      photoUrl,
    });

    sendTokenCookie(user, 217, res, 'User registered and authenticated successfully');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: user not found',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: password incorrect',
      });
    }

    sendTokenCookie(user, 200, res, 'Login successful');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// POST /api/auth/jwt - Generate/set a token for a given email (ideal for social login or session renewal)
exports.generateJWT = async (req, res) => {
  try {
    const { email, name, photoUrl } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to generate token',
      });
    }

    // Find or automatically create user (for social login compatibility)
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // If user does not exist, let's create a stub/mock user
      // with a secure default hashed password
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: Math.random().toString(36).substring(2, 15) + 'A1a!', // random password for OAuth stubs
        photoUrl: photoUrl,
      });
    }

    sendTokenCookie(user, 200, res, 'JWT token successfully generated and set in secure cookie');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during token generation',
      error: error.message,
    });
  }
};

// Logout - Clear cookies
exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0), // expire immediately
    };

    res.clearCookie('token', cookieOptions);
    res.clearCookie('jwt', cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully, cookies cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message,
    });
  }
};

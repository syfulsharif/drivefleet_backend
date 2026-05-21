const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Extract token from HTTPOnly cookie first, then fallback to Authorization header if provided
  const token = req.cookies?.token || req.cookies?.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Access token is missing or not provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yBkVfMXsM3g8aHbB');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid or expired access token',
    });
  }
};

module.exports = verifyToken;

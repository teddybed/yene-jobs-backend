const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authMiddleware = (requiredRoles = []) => async (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from DB
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Check role if required
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access Denied. Insufficient permissions.' });
    }

    // Attach user to req
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;

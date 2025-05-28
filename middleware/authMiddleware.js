const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import the User model
require('dotenv').config();

const authMiddleware = (requiredRoles) => async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  // Split 'Bearer <token>'
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Retrieve the user from the database (optional)
    const user = await User.findByPk(req.user.id); // Assuming `id` is in the token payload

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Check if the user's role is allowed
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access Denied. Insufficient permissions.' });
    }

    // Attach the user to the request object for further use
    req.user = user;

    next();
  } catch (error) {
    // Handle invalid token or error in database query
    return res.status(403).json({ message: 'Invalid token or error occurred.' });
  }
};

module.exports = authMiddleware;

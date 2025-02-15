import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/User.js';
import { TokenBlacklist } from '../models/TokenBlacklist.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Check if token is blacklisted
      const isBlacklisted = await TokenBlacklist.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          error: 'Token is no longer valid'
        });
      }

      // Set user in request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role.toLowerCase() // Ensure role is lowercase for consistent comparison
      };

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Token is invalid or expired'
      });
    }
  } catch (error) {
    next(error);
  }
};
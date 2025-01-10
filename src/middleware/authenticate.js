import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/User.js';
import { TokenBlacklist } from '../models/TokenBlacklist.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

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
      // Check if token is blacklisted
      const blacklistedToken = await TokenBlacklist.findOne({ token });
      if (blacklistedToken) {
        return res.status(401).json({
          success: false,
          error: 'Token has been invalidated'
        });
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Include role in the user object
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      req.user = {
        id: user._id,
        role: user.role
      };
      req.token = token;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};
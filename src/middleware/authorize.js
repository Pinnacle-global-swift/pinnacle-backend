import { ValidationError } from '../utils/errors.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Check if user exists and has a role
      if (!req.user || !req.user.role) {
        throw new ValidationError('User role not found', 403);
      }

      // Check if user's role is included in the allowed roles
      if (!roles.includes(req.user.role.toLowerCase())) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to access this route'
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // Handle email errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ESOCKET') {
    return res.status(500).json({
      success: false,
      error: {
        message: 'Email service temporarily unavailable',
        code: 500
      }
    });
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    return res.status(503).json({
      success: false,
      error: {
        message: 'Database connection error. Please try again later.',
        code: 503
      }
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: Object.values(err.errors).map(e => e.message).join(', '),
        code: 400
      }
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: err.statusCode || 500
    }
  });
};
import { logger } from '../utils/logger.js';

export const databaseErrorHandler = (err, req, res, next) => {
  logger.error('Database Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(err.statusCode || 400).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode || 400
      }
    });
  }

  if (err.name === 'TransactionError') {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode || 500
      }
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 500
    }
  });
};
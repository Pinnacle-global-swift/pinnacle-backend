import { logger } from '../utils/logger.js';
import { ValidationError, TransactionError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err instanceof ValidationError || err instanceof TransactionError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode
      }
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
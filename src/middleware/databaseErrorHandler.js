import { logger } from '../utils/logger.js';

export const databaseErrorHandler = (err, req, res, next) => {
  // Log the full error for debugging
  logger.error('Database Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });

  // Handle different types of database errors
  switch (err.name) {
    case 'MongoNotConnectedError':
      return res.status(503).json({
        success: false,
        error: {
          message: 'Database connection not ready. Please try again.',
          code: 503
        }
      });

    case 'MongoNetworkError':
    case 'MongoTimeoutError':
      return res.status(503).json({
        success: false,
        error: {
          message: 'Database service temporarily unavailable. Please try again later.',
          code: 503
        }
      });

    case 'MongooseError':
      if (err.message.includes('buffering timed out')) {
        return res.status(503).json({
          success: false,
          error: {
            message: 'Request timed out. Please try again.',
            code: 503
          }
        });
      }
      break;

    case 'MongoServerError':
      if (err.code === 11000) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Duplicate entry found.',
            code: 409
          }
        });
      }
      break;

    case 'ValidationError':
      return res.status(400).json({
        success: false,
        error: {
          message: Object.values(err.errors).map(e => e.message).join(', '),
          code: 400
        }
      });
  }

  // If error wasn't handled above, pass it to the next error handler
  next(err);
}; 
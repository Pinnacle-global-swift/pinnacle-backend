import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from '../utils/logger.js';

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting) {
    logger.warn('Connection already in progress');
    return;
  }

  try {
    isConnecting = true;

    const options = {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4,
      retryWrites: true,
      retryReads: true,
      autoIndex: true,
      heartbeatFrequencyMS: 10000,
    };

    // Clear any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Remove all existing listeners
    mongoose.connection.removeAllListeners();

    // Set up connection event handlers
    mongoose.connection.on('connecting', () => {
      logger.info('Initiating MongoDB connection...');
    });

    mongoose.connection.on('connected', () => {
      isConnecting = false;
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('disconnected', () => {
      isConnecting = false;
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(async () => {
        try {
          await connectDB();
        } catch (err) {
          logger.error('Reconnection attempt failed:', err);
        }
      }, 5000);
    });

    mongoose.connection.on('error', (err) => {
      isConnecting = false;
      logger.error('MongoDB connection error:', err);
      if (err.name === 'MongoNetworkError') {
        setTimeout(async () => {
          try {
            await connectDB();
          } catch (err) {
            logger.error('Reconnection attempt failed:', err);
          }
        }, 5000);
      }
    });

    // Wait for successful connection
    const conn = await mongoose.connect(config.mongoUri, options);
    
    // Set buffer timeout
    mongoose.set('bufferTimeoutMS', 30000);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnecting = false;
    logger.error('MongoDB connection error:', error);
    
    const retryCount = (mongoose.connection.retryCount || 0) + 1;
    mongoose.connection.retryCount = retryCount;
    
    if (retryCount <= 5) {
      const retryTimeout = Math.min(1000 * Math.pow(2, retryCount), 60000);
      logger.info(`Retrying connection in ${retryTimeout/1000} seconds... (Attempt ${retryCount})`);
      
      await new Promise(resolve => setTimeout(resolve, retryTimeout));
      return connectDB();
    } else {
      logger.error('Maximum retry attempts reached. Please check your database configuration.');
      process.exit(1);
    }
  }
};

// Create a promise that resolves when the connection is ready
const waitForConnection = () => {
  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      resolve();
    } else {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    }
  });
};

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  logger.error('Uncaught Exception:', err);
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed due to uncaught exception');
    process.exit(1);
  } catch (err) {
    logger.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export { connectDB, waitForConnection };
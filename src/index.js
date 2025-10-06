import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { config } from './config/config.js';
import { connectDB, waitForConnection } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { userRoutes } from './routes/userRoutes.js';
import { productRoutes } from './routes/productRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { accountRoutes } from './routes/accountRoutes.js';
import { cardRoutes } from './routes/cardRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';
import { publicRoutes } from './routes/publicRoutes.js';
import { logger } from './utils/logger.js';
import { kycRoutes } from './routes/kycRoutes.js';
import { adminCardRoutes } from './routes/adminCardRoutes.js';
import { withdrawalRoutes } from './routes/withdrawalRoutes.js';
import { transactionRoutes } from './routes/transactionRoutes.js';
import { adminKycRoutes } from './routes/adminKycRoutes.js';
import { transferRoutes } from './routes/transferRoutes.js';
// import { adminDashboardRoutes } from './routes/adminDashboardRoutes.js';
// import { adminUserRoutes } from './routes/adminUserRoutes.js';
import { databaseErrorHandler } from './middleware/databaseErrorHandler.js';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));



// Add database connection check middleware
app.use(async (req, res, next) => {
  try {
    await waitForConnection();
    next();
  } catch (error) {
    next(error);
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pinnacle Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Swagger Documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// // Public routes
// app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);

// // Protected routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/transfer', transferRoutes);


// Admin routes - Keep only the main admin route
app.use('/api/admin', adminRoutes);
app.use('/api/admin/kyc', adminKycRoutes);

// Error handling middleware (order matters)
app.use(databaseErrorHandler);  // Handle database errors first
app.use(errorHandler);          // Handle other errors
app.use(notFound);             // Handle 404 last

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Wait for connection to be ready
    await waitForConnection();

    // Start server only after successful database connection
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
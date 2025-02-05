import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';
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
import { adminDashboardRoutes } from './routes/adminDashboardRoutes.js';
import { adminUserRoutes } from './routes/adminUserRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// RoutestransferRoutes
app.use('/api/public', publicRoutes); // Public routes should be before authentication
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/admin/kyc', adminKycRoutes);
app.use('/api/transfer', transferRoutes);


app.use('/api/admin', adminRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/dashboard/users', adminUserRoutes);
app.use('/api/admin/cards', adminCardRoutes); 


// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
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
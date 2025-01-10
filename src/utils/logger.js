import winston from 'winston';
import { config } from '../config/config.js';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple()
);

export const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
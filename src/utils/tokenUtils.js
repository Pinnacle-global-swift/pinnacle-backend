import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role 
    }, 
    config.jwtSecret, 
    { expiresIn: '30d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
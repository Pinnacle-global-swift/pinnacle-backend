import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (user, role) => {
  const expiresIn = role === 'admin' ? '7d' : '2h'; // Set expiration based on role
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn });
}; 
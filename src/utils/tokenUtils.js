import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { TOKEN_EXPIRATION_TIME } from '../config/constants.js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    {
      expiresIn: TOKEN_EXPIRATION_TIME // This will be 360 seconds as defined in constants.js
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
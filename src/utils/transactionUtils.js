import crypto from 'crypto';

export const generateReference = () => {
  return `TXN${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};
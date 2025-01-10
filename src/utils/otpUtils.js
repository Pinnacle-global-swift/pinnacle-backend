import crypto from 'crypto';

export const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isOTPValid = (storedOTP, providedOTP, otpExpiry) => {
  if (!storedOTP || !otpExpiry) {
    return false;
  }

  // Check if OTP has expired (15 minutes validity)
  if (Date.now() > otpExpiry) {
    return false;
  }

  return storedOTP === providedOTP;
};
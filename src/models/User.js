import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  accountType: {
    type: String,
    required: [true, 'Please select account type'],
    enum: ['personal', 'business', "corporate"]
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Please select gender'],
    enum: ['male', 'female', 'other']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  plainPassword: {
    type: String,
    select: false
  },
  country: {
    type: String,
    required: [true, 'Please select country']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    type: String,
    required: [true, 'Please provide your address']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number']
  },
  uniqueId: {
    type: String,
    unique: true,
    required: true
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'none'],
    default: 'none'
  },
  resetPasswordOTP: String,
  resetPasswordOTPExpiry: Date,
  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationAttempts: {
    type: Number,
    default: 0
  },
  lastVerificationAttempt: {
    type: Date
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('PinnacleUser', userSchema);
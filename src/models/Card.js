
  import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
    required: true
  },
  type: {
    type: String,
    enum: ['mastercard'],
    default: 'mastercard',
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  maskedCardNumber: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true,
    select: false // CVV is not returned in queries by default
  },
  pinHash: {
    type: String,
    select: false // PIN hash is not returned in queries by default
  },
  expiryMonth: {
    type: String,
    required: true
  },
  expiryYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'blocked', 'expired'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  paymentMethod: String,
  transactionId: String,
  paymentDate: Date,
  limit: {
    type: Number,
    required: true
  },
  activationDate: Date
}, {
  timestamps: true
});

// Middleware to format card number before saving
cardSchema.pre('save', function(next) {
  if (this.isModified('cardNumber')) {
    this.maskedCardNumber = `****-****-****-${this.cardNumber.slice(-4)}`;
  }
  next();
});

export const Card = mongoose.model('PinnacleCard', cardSchema);
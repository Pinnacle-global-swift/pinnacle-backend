import mongoose from 'mongoose';
import { KYC_STATUS } from '../constants/status.js';

const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
    required: true,
    unique: true
  },
  fullLegalName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  idType: {
    type: String,
    enum: ['passport', 'national_id', 'drivers_license'],
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  residentialAddress: {
    type: String,
    required: true
  },
  idFrontImage: {
    type: String,
    required: true
  },
  idBackImage: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(KYC_STATUS),
    default: KYC_STATUS.PROCESSING
  },
  verificationDate: {
    type: Date
  }
}, {
  timestamps: true
});

export const KYC = mongoose.model('PinnacleKYC', kycSchema);
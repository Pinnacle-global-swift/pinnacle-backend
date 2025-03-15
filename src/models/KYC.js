import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
    required: true
  },
  fullLegalName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
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
  status: {
    type: String,
    enum: ['processing', 'approved', 'rejected', 'additional_info_required'],
    default: 'processing'
  },
  remarks: String,
  verificationDate: Date,
  additionalInfoRequired: String,
  additionalInfo: Object,
  documents: {
    idFront: String,
    idBack: String,
    selfie: String,
    proofOfAddress: String
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PinnacleUser',
  },
  processedAt: Date
}, {
  timestamps: true
});

export const KYC = mongoose.model('pinnaclekycs', kycSchema);
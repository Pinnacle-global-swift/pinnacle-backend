import express from 'express';
import multer from 'multer';
import { kycController } from '../controllers/kycController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Configure file upload fields
const uploadFields = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 }
]);

const kycValidation = [
  body('fullLegalName').trim().notEmpty().withMessage('Full legal name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('nationality').trim().notEmpty().withMessage('Nationality is required'),
  body('idType').isIn(['passport', 'national_id', 'drivers_license']).withMessage('Valid ID type is required'),
  body('idNumber').trim().notEmpty().withMessage('ID number is required'),
  body('residentialAddress').trim().notEmpty().withMessage('Residential address is required')
];

router.post(
  '/submit', 
  authenticate, 
  uploadFields,
  kycValidation, 
  validate, 
  kycController.submitKYC
);

router.get('/status', authenticate, kycController.getKYCStatus);

export const kycRoutes = router;
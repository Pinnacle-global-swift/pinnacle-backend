import express from 'express';
import { kycController } from '../controllers/kycController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

const kycValidation = [
  body('fullLegalName').trim().notEmpty().withMessage('Full legal name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('nationality').trim().notEmpty().withMessage('Nationality is required'),
  body('idType').isIn(['passport', 'national_id', 'drivers_license']).withMessage('Valid ID type is required'),
  body('idNumber').trim().notEmpty().withMessage('ID number is required'),
  body('residentialAddress').trim().notEmpty().withMessage('Residential address is required'),
  body('idFrontImage').trim().notEmpty().withMessage('Front ID image is required'),
  body('idBackImage').trim().notEmpty().withMessage('Back ID image is required')
];

router.post('/submit', authenticate, kycValidation, validate, kycController.submitKYC);
router.get('/status', authenticate, kycController.getKYCStatus);

export const kycRoutes = router;
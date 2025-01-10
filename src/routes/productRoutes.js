import express from 'express';
import { productController } from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required')
];

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', productValidation, validate, productController.createProduct);
router.put('/:id', productValidation, validate, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export const productRoutes = router;
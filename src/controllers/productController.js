import { Product } from '../models/Product.js';

export const productController = {
  // Get all products
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Product.find();
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  },


  // Get single product
  getProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },
  

  // Create product
  createProduct: async (req, res, next) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  // Update product
  updateProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete product
  deleteProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
};
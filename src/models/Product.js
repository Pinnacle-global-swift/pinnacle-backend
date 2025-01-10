import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category']
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Product = mongoose.model('PinnacleProduct', productSchema);
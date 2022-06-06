const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A product name must have less or equal then 40 characters'],
  },
  energy: {
    type: Number,
    required: [true, 'A product must have an energy value'],
  },
  whey: Number,
  carbohydrates: Number,
  fat: Number,
  createdAt: { type: Date, default: Date.now() },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

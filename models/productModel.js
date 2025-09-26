const mongoose = require('mongoose');

// 1) تعريف الـ Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   // الاسم مطلوب
  },
  price: {
    type: Number,
    required: true,   // السعر مطلوب
  },
  description: {
    type: String,
  },
});

// 2) إنشاء الـ Model
const Product = mongoose.model('Product', ProductSchema);

// 3) تصدير الـ Model
module.exports = Product;








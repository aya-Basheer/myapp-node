
// controllers/productController.js
const Product = require('../models/productModel');
const logger = require('../utils/logger');




const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new product

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const product = new Product({ name, description, price, category, createdBy: req.user.id });
    await product.save();

    logger.info(`Product created: ${product._id} by ${req.user.email}`);

    // for Phase 3 we'll emit socket event here via req.app.get('io')

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    logger.error('Create product error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};


// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct };
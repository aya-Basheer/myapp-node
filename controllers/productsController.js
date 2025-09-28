// controllers/productController.js
const Product = require('../models/productModel');
const logger = require('../utils/logger');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    logger.error('Get all products error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    logger.error('Get single product error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      createdBy: req.user.id,
    });
    await product.save();

    logger.info(`Product created: ${product._id} by ${req.user.email}`);

    // Emit newProduct event via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('newProduct', {
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        createdAt: product.createdAt,
      });
    }

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    logger.error('Create product error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    logger.error('Update product error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    logger.info(`Product deleted: ${deletedProduct._id} by ${req.user.email}`);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    logger.error('Delete product error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};

// routes/productsRoutes.js
const express = require('express');
const router = express.Router();




// routes/productRoutes.js

const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleMiddleware');
const { productCreateValidator } = require('../middlewares/validators');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getSingleProduct);
router.post('/', auth, productCreateValidator, productController.createProduct); // protected
router.put('/:id', auth, productCreateValidator, productController.updateProduct); // protected
router.delete('/:id', auth, roleCheck(['admin']), productController.deleteProduct); // admin only

module.exports = router;

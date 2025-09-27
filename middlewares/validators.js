// middlewares/validators.js
const { body, validationResult } = require('express-validator');

const registerValidator = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').exists().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

const productCreateValidator = [
  body('name').isLength({ min: 2 }).withMessage('Product name at least 2 chars'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be > 0'),
  body('category').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

module.exports = { registerValidator, loginValidator, productCreateValidator };

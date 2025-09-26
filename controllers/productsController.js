// controllers/productsController.js

// in-memory store
let products = [
  { id: '1', name: 'Sample Product', category: 'demo', price: 9.99, description: 'A demo product' }
];

// GET /api/products?name=&category=&minPrice=&maxPrice=
const getAllProducts = (req, res) => {
  let result = products.slice();
  const { name, category, minPrice, maxPrice } = req.query;

  if (name) {
    const q = name.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q));
  }
  if (category) {
    const q = category.toLowerCase();
    result = result.filter(p => (p.category || '').toLowerCase() === q);
  }
  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (!Number.isNaN(min)) result = result.filter(p => Number(p.price) >= min);
  }
  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(max)) result = result.filter(p => Number(p.price) <= max);
  }

  return res.json({ count: result.length, products: result });
};

const getSingleProduct = (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(product);
};

module.exports = { getAllProducts, getSingleProduct, /* future: create/update/delete */ };

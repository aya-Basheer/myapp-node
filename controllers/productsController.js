// controllers/productsController.js

let products = [
  { id: '1', name: 'Sample Product', category: 'demo', price: 9.99, description: 'A demo product' }
];

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

// READ
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

// CREATE
const createProduct = (req, res) => {
  const { name, category, price, description } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'name and price are required' });
  }
  const newProduct = {
    id: genId(),
    name,
    category: category || 'uncategorized',
    price: Number(price),
    description: description || ''
  };
  products.push(newProduct);
  return res.status(201).json(newProduct);
};

// UPDATE (partial allowed)
const updateProduct = (req, res) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });

  const { name, category, price, description } = req.body;
  if (name !== undefined) products[idx].name = name;
  if (category !== undefined) products[idx].category = category;
  if (price !== undefined) products[idx].price = Number(price);
  if (description !== undefined) products[idx].description = description;

  return res.json(products[idx]);
};

// DELETE
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  const deleted = products.splice(idx, 1)[0];
  return res.json({ message: 'Deleted', product: deleted });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

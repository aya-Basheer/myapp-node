// server.js
const express = require('express');
const productsRouter = require('./routes/productsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// routes
app.use('/api/products', productsRouter);

// health
app.get('/', (req, res) => res.send('Products API is running'));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

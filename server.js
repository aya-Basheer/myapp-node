// server.js

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const productsRouter = require('./routes/productsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;


dotenv.config(); // تحميل متغيرات البيئة من .env




// Middleware
app.use(express.json()); // لمعالجة JSON من body
app.use(morgan('dev'));  //  تسجيل جميع الطلبات في الكونسول


// Custom middleware: تسجيل التاريخ والوقت لكل طلب
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});


// Test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});
// routes
app.use('/api/products', productsRouter);





// Middleware
app.use(express.json()); // لمعالجة JSON من body
app.use(morgan('dev'));  // تسجيل جميع الطلبات في الكونسول

// Custom middleware: تسجيل التاريخ والوقت لكل طلب
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));



app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

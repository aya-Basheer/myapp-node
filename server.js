// Import dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');


const productsRouter = require('./routes/productsRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// ✅ Middleware - must be before routes
app.use(express.json()); // process JSON from body
app.use(morgan('dev'));  // log requests to console
app.use(express.static('public'));
// Custom middleware: log timestamp and request method/url
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRoutes);

// create HTTP server
const server = http.createServer(app);

// init Socket.io
const io = new Server(server, {
  cors: { origin: '*' } // adjust for production
});

// attach io to app for controllers to use
app.set('io', io);

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('chatMessage', (msg) => {
socket.broadcast.emit('chatMessage', { id: socket.id, message: msg });

  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydb')
  .then(() => {
   

    server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch(err => logger.error('DB connection error', { error: err }));

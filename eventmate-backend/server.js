const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional - for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ============================================
// IMPORT ROUTES
// ============================================
const eventRoutes = require('./routes/events');
const guestRoutes = require('./routes/guests');
const vendorRoutes = require('./routes/vendors');

// ============================================
// MONGODB CONNECTION
// ============================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventmate';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/vendors', vendorRoutes);

// ============================================
// ROOT ROUTE
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to EventMate API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      events: '/api/events',
      guests: '/api/guests',
      vendors: '/api/vendors'
    },
    documentation: {
      events: {
        getAll: 'GET /api/events',
        getOne: 'GET /api/events/:id',
        getDetails: 'GET /api/events/:id/details',
        getStats: 'GET /api/events/:id/stats',
        create: 'POST /api/events',
        update: 'PUT /api/events/:id',
        updateStatus: 'PATCH /api/events/:id/status',
        delete: 'DELETE /api/events/:id'
      },
      guests: {
        getAll: 'GET /api/guests/event/:eventId',
        getOne: 'GET /api/guests/:id',
        getStats: 'GET /api/guests/event/:eventId/stats',
        create: 'POST /api/guests',
        createBulk: 'POST /api/guests/bulk',
        update: 'PUT /api/guests/:id',
        updateRSVP: 'PATCH /api/guests/:id/rsvp',
        delete: 'DELETE /api/guests/:id',
        deleteAll: 'DELETE /api/guests/event/:eventId/all'
      },
      vendors: {
        getAll: 'GET /api/vendors/event/:eventId',
        getOne: 'GET /api/vendors/:id',
        getByCategory: 'GET /api/vendors/event/:eventId/category/:category',
        getStats: 'GET /api/vendors/event/:eventId/stats',
        create: 'POST /api/vendors',
        createBulk: 'POST /api/vendors/bulk',
        update: 'PUT /api/vendors/:id',
        updateStatus: 'PATCH /api/vendors/:id/status',
        updateContract: 'PATCH /api/vendors/:id/contract',
        delete: 'DELETE /api/vendors/:id',
        deleteAll: 'DELETE /api/vendors/event/:eventId/all'
      }
    }
  });
});

// ============================================
// HEALTH CHECK ROUTE
// ============================================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    path: req.path
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('🚀 EventMate Backend API Server');
  console.log('='.repeat(50));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
  console.log('');
  console.log('📚 Available Routes:');
  console.log(`   → Events:  http://localhost:${PORT}/api/events`);
  console.log(`   → Guests:  http://localhost:${PORT}/api/guests`);
  console.log(`   → Vendors: http://localhost:${PORT}/api/vendors`);
  console.log('');
  console.log('💡 Press Ctrl+C to stop the server');
  console.log('');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

module.exports = app;

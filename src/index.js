require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Ensure uploads directory exists ──────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (payment screenshots, etc.)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health check ──────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/meals',  require('./routes/meals'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/plans',  require('./routes/plans'));
app.use('/api/admin',  require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global error handler (must be last)
app.use(require('./middleware/errorHandler'));

// ── Database & Server Start ───────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiffinwala')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 TiffinWala API running on http://localhost:${PORT}`);
      console.log(`📋 Routes:`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/meals`);
      console.log(`   GET  /api/meals/addons`);
      console.log(`   POST /api/orders`);
      console.log(`   GET  /api/orders/my`);
      console.log(`   POST /api/orders/:id/payment`);
      console.log(`   GET  /api/admin/stats`);
      console.log(`   GET  /api/admin/orders/pending`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;

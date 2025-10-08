const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Balance Sheet Test endpoint
app.get('/api/reports/balance-sheet/test', (req, res) => {
  console.log('📊 Balance Sheet test request received');
  res.json({ message: 'Balance Sheet endpoint works!', timestamp: new Date().toISOString() });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

console.log('Simple test server running...');
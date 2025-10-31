// Optimized Core Configuration
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Models
const models = require('./models');

// Utilities
const { signToken, auth, allow, upload, errorHandler } = require('./utils/middleware');
const { connectDB } = require('./utils/database');

const app = express();

// ===================== MIDDLEWARE =====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ 
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000", "http://localhost:3003"], 
  credentials: true 
}));
app.use(morgan('dev'));

// ===================== DATABASE =====================
connectDB();

// ===================== ROUTES =====================
const routes = {
  auth: require('./routes/auth'),
  user: require('./routes/user'),
  business: require('./routes/business'),
  invoice: require('./routes/invoice'),
  transaction: require('./routes/transaction'),
  reports: require('./routes/reports'),
  taxcalc: require('./routes/taxcalc'),
  taxdata: require('./routes/taxdata'),
  taxreports: require('./routes/taxreports'),
  gst: require('./routes/gst'),
  tds: require('./routes/tds'),
  export: require('./routes/export'),
  clients: require('./routes/clients'),
  returns: require('./routes/gstReturns'),
  firebaselogin: require('./routes/myfirebase')
};

// Mount routes
Object.entries(routes).forEach(([name, router]) => {
  app.use(`/api/${name}`, router);
});

// Mount auth at /auth as well for backward compatibility
app.use('/auth', routes.auth);

// Static files
app.use('/uploads', express.static('uploads'));

// Error handling
app.use(errorHandler);

// ===================== SERVER =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
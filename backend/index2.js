///Core modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan');
const dayjs = require('dayjs');
const path = require('path');
const express = require('express');

//local modules
const invoiceRoutes = require('./routes/invoice');
const businessRoutes = require('./routes/business');
const assignCARoutes = require('./routes/cabussiness');
const transactionRoutes = require('./routes/transaction');
const taxcalcRoute = require('./routes/taxcalc');
const exportRoutes = require('./routes/export');
const extraRoutes=require('./routes/extra')
const tdsRoutes = require('./routes/tds');
const gstRoutes = require('./routes/gst');
const authroutes=require('./routes/myfirebase')
const gstInvoicesRoutes = require('./routes/gstInvoices');
const gstReturnsRoutes = require('./routes/gstReturns');
const settingsRoutes = require('./routes/settings');

const app = express();

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

// Models - All imported from centralized index
const {
  User,
  Business,
  ChartAccount,
  Transaction,
  JournalEntry,
  BankTxn,
  Invoice,
  ReturnUpload,
  DocShare,
  RecurringTemplate,
  TDS,
  GSTInvoice,
  GSTReturn,
  Taxpayer
} = require('./models');


// --------------------- Middleware ---------------------
app.use(express.json({ limit: '50mb' })); // Increased limit for large data exports
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3003"], credentials: true }));
app.use(morgan('dev'));

// --------------------- MongoDB ---------------------
mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'Finance' })
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((e) => console.error('MongoDB Atlas error ->', e.message));

// --------------------- Auth & Utilities ---------------------
const ROLES = { CA: 'CA', OWNER: 'OWNER', EMPLOYEE: 'EMPLOYEE' };

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, biz: user.business }, process.env.JWT_SECRET, { expiresIn: '7d' });

const auth = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
};

const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

// File uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${ts}_${safe}`);
  },
});
const upload = multer({ storage });

// --------------------- Routes ---------------------

// Auth
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT with complete user info
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        biz: user.business 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove sensitive info (like password, __v, etc.)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      business: user.business,
      businessName: user.businessName,
      phone: user.phone,
      gstin: user.gstin,
      pan: user.pan
    };

    return res.json({ 
      success: true,
      token, 
      user: safeUser,
      message: 'Login successful'
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// Get current user data
app.get('/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      business: user.business,
      businessName: user.businessName,
      phone: user.phone,
      gstin: user.gstin,
      pan: user.pan,
      city: user.city,
      state: user.state,
      filingScheme: user.filingScheme
    };

    return res.json({ 
      success: true,
      user: safeUser 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// Get user profile data (current user's own data)
app.get('/auth/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      business: user.business,
      businessName: user.businessName,
      phone: user.phone,
      gstin: user.gstin,
      pan: user.pan,
      city: user.city,
      state: user.state,
      filingScheme: user.filingScheme,
      taxData: user.taxData || {
        annualIncome: 0,
        taxRegime: 'new',
        totalTaxSaved: 0,
        estimatedAnnualTax: 0
      }
    };

    return res.json({ 
      success: true,
      user: userProfile 
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

app.post('/auth/register', async (req, res) => {
  console.log("I got this data", req.body) // For debugging
  try {
    const { firstName, lastName, email, phone, password, role, company } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const name = `${firstName} ${lastName}`;

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    return res.status(201).json({ id: user._id, message: "User registered successfully" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: e.message });
  }
});


app.use('/api/business', businessRoutes);      // /api/business → create/list business
app.use('/api/business', assignCARoutes);      // /api/business/:id/assign-ca/:caId → assign CA
app.use('/api/firebaselogin', authroutes)
app.use('/api/invoice', invoiceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/taxcalc', taxcalcRoute);
app.use('/api/export', exportRoutes);
app.use('/api/extra', extraRoutes);  
app.use('/api/tds', tdsRoutes);              // /api/tds → TDS management
app.use('/api/gst', gstRoutes);              // /api/gst → GST summary and periods
app.use('/api/invoices', gstInvoicesRoutes); // /api/invoices → GST invoice management
app.use('/api/returns', gstReturnsRoutes);   // /api/returns → GST returns management
app.use('/api/user', settingsRoutes);       // /api/user → User settings management

// Import new organized route files
const clientRoutes = require('./routes/clients');
const taxDataRoutes = require('./routes/taxdata');
const reportsRoutes = require('./routes/reports');
const taxReportsRoutes = require('./routes/taxreports');

// Mount the new routes
app.use('/api/clients', clientRoutes);           // /api/clients → Client management
app.use('/api/taxdata', taxDataRoutes);         // /api/taxdata → Tax data management  
app.use('/api/reports', reportsRoutes);         // /api/reports → Financial reports (P&L, Balance Sheet, Cash Flow)
app.use('/api/reports/tax', taxReportsRoutes);  // /api/reports/tax → Tax reports (GST, TDS)

// --------------------- Server ---------------------
const PORT = process.env.PORT || 4000;
app.use('/uploads', express.static('uploads'));
app.get('/', (_, res) => res.send('Accounting/GST backend is running ✔'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
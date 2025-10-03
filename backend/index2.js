///Core modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
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
const tdsRoutes = require('./routes/tds');
const gstRoutes = require('./routes/gst');
const gstInvoicesRoutes = require('./routes/gstInvoices');
const gstReturnsRoutes = require('./routes/gstReturns');

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
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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

    // Generate JWT
   const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

     
    // Remove sensitive info (like password, __v, etc.)
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      business: user.business
    };

    return res.json({ token, user: safeUser });
  } catch (e) {
    return res.status(400).json({ message: e.message });
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

app.use('/api/invoice', invoiceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/taxcalc', taxcalcRoute);
app.use('/api/export', exportRoutes);
app.use('/api/tds', tdsRoutes);              // /api/tds → TDS management
app.use('/api/gst', gstRoutes);              // /api/gst → GST summary and periods
app.use('/api/invoices', gstInvoicesRoutes); // /api/invoices → GST invoice management
app.use('/api/returns', gstReturnsRoutes);   // /api/returns → GST returns management


/* Business
app.post('/business', auth, allow(ROLES.CA, ROLES.OWNER), async (req, res) => {
  try {
    const biz = await Business.create({ ...req.body });
    return res.status(201).json(biz);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

app.get('/business', auth, async (req, res) => {
  const query = {};
  if (req.user.role === ROLES.CA) query.assignedCA = req.user.id;
  else if (req.user.biz) query._id = req.user.biz;
  const list = await Business.find(query).lean();
  return res.json(list);
});

app.post('/business/:id/assign-ca/:caId', auth, allow(ROLES.OWNER, ROLES.CA), async (req, res) => {
  const { id, caId } = req.params;
  const updated = await Business.findByIdAndUpdate(id, { assignedCA: caId }, { new: true });
  return res.json(updated);
});

// Transactions
app.post('/transactions', auth, upload.single('receipt'), async (req, res) => {
  try {
    const { description, amount, category, coa, date, gstRate, gstInput } = req.body;
    const amountNum = Number(amount);
    const tx = await Transaction.create({
      business: req.user.biz,
      date: date ? new Date(date) : new Date(),
      description,
      amount: amountNum,
      category,
      coa,
      receiptUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      source: 'MANUAL',
      gst: gstRate ? { rate: Number(gstRate), amount: (amountNum * Number(gstRate)) / 100, input: !!gstInput } : undefined,
    });
    return res.status(201).json(tx);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

app.get('/transactions', auth, async (req, res) => {
  const { from, to, category } = req.query;
  const q = { business: req.user.biz };
  if (from || to) q.date = {};
  if (from) q.date.$gte = new Date(from);
  if (to) q.date.$lte = new Date(to);
  if (category) q.category = category;
  const list = await Transaction.find(q).sort({ date: -1 }).lean();
  return res.json(list);
});*/

// --------------------- Server ---------------------
const PORT = process.env.PORT || 4000;
app.use('/uploads', express.static('uploads'));
app.get('/', (_, res) => res.send('Accounting/GST backend is running ✔'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    const pdfGenerator = require('./utils/pdfGenerator');
    await pdfGenerator.closeBrowser();
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
  process.exit(0);
});

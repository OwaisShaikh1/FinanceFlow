const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan');
const dayjs = require('dayjs');
const path = require('path');

const invoiceRoutes = require('./routes/invoice');
const businessRoutes = require('./routes/business');
const assignCARoutes = require('./routes/cabussiness');
const transactionRoutes = require('./routes/transaction');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

// Models
const User = require('./models/User');
const {
  Business,
  ChartAccount,
  Transaction,
  JournalEntry,
  BankTxn,
  Invoice,
  ReturnUpload,
  DocShare,
  RecurringTemplate,
} = require('./models'); // index.js inside models folder exports all models

const app = express();

// --------------------- Middleware ---------------------
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan('dev'));

// --------------------- MongoDB ---------------------
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'financeflow' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((e) => console.error('MongoDB error ->', e.message));

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
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({ token, role: user.role, business: user.business });
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

// TODO: Keep rest of routes (Invoices, Bank, Reports, Dashboard, Docs) similar structure...

// --------------------- Server ---------------------
const PORT = process.env.PORT || 4000;
app.use('/uploads', express.static('uploads'));
app.get('/', (_, res) => res.send('Accounting/GST backend is running ✔'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

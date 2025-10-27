const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan');
const dayjs = require('dayjs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ----------------------------------------------------------------------------
// DB
// ----------------------------------------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'accounting_demo' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((e) => console.error('MongoDB error ->', e.message));

// ----------------------------------------------------------------------------
// Helpers & Middleware
// ----------------------------------------------------------------------------
const ROLES = { CA: 'CA', ADMIN: 'Admin', USER: 'user' };

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, biz: user.business }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

const auth = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
};

const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// File uploads (receipts/docs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${ts}_${safe}`);
  },
});
const upload = multer({ storage });

// ----------------------------------------------------------------------------
// Schemas/Models (compact)
// ----------------------------------------------------------------------------
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: String,
    role: { type: String, enum: Object.values(ROLES), default: ROLES.OWNER },
    // For multi-tenant: which business this user belongs to (null for CA w/ many)
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
  },
  { timestamps: true }
);

const BusinessSchema = new mongoose.Schema(
  {
    name: String,
    gstin: String,
    address: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // A CA can manage multiple businesses; map relationships:
    assignedCA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const ChartAccountSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    name: String,
    code: String,
    type: { type: String, enum: ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE'] },
  },
  { timestamps: true }
);

const TransactionSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    date: { type: Date, default: Date.now },
    description: String,
    amount: Number, // positive for income, negative for expense (or use separate field)
    category: String, // rent, salaries, sales, etc.
    coa: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount' },
    receiptUrl: String,
    source: { type: String, enum: ['MANUAL', 'BANK_UPLOAD'], default: 'MANUAL' },
    gst: { rate: Number, amount: Number, input: Boolean }, // simple GST info
  },
  { timestamps: true }
);

const JournalEntrySchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    date: { type: Date, default: Date.now },
    lines: [
      {
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartAccount' },
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        memo: String,
      },
    ],
  },
  { timestamps: true }
);

const BankTxnSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    bankRef: String, // id from bank/csv
    date: Date,
    amount: Number,
    description: String,
    matchedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', default: null },
  },
  { timestamps: true }
);

const InvoiceSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    number: String,
    customerName: String,
    customerGSTIN: String,
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
        gstRate: Number, // e.g., 0, 5, 12, 18, 28
      },
    ],
    status: { type: String, enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE'], default: 'DRAFT' },
    issueDate: Date,
    dueDate: Date,
    pdfUrl: String,
    ewayBillNo: String,
  },
  { timestamps: true }
);

const ReturnUploadSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    type: { type: String, enum: ['GSTR1', 'GSTR3B', 'TDS', 'ITR'] },
    period: String, // e.g., 2025-07, Q1-2025
    fileUrl: String, // stored file path or cloud link
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const DocShareSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    notes: String,
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
const Business = mongoose.model('Business', BusinessSchema);
const ChartAccount = mongoose.model('ChartAccount', ChartAccountSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);
const BankTxn = mongoose.model('BankTxn', BankTxnSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const ReturnUpload = mongoose.model('ReturnUpload', ReturnUploadSchema);
const DocShare = mongoose.model('DocShare', DocShareSchema);

// ----------------------------------------------------------------------------
// Auth Routes (Email+Password). For Phone OTP or OAuth, add providers.
// ----------------------------------------------------------------------------
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, businessId } = req.body;
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await User.create({ name, email, phone, passwordHash, role, business: businessId || null });
    return res.status(201).json({ id: user._id });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: user.business,
      },
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// ----------------------------------------------------------------------------
// Client Management (CA manages multiple businesses)
// ----------------------------------------------------------------------------
app.post('/business', auth, allow(ROLES.CA, ROLES.OWNER), async (req, res) => {
  try {
    const biz = await Business.create({ ...req.body });
    return res.status(201).json(biz);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

app.get('/business', auth, async (req, res) => {
  // CA: list all assigned; Owner/Employee: list their business
  const query = {};
  if (req.user.role === ROLES.CA) {
    query.assignedCA = req.user.id;
  } else if (req.user.biz) {
    query._id = req.user.biz;
  }
  const list = await Business.find(query).lean();
  return res.json(list);
});

app.post('/business/:id/assign-ca/:caId', auth, allow(ROLES.OWNER, ROLES.CA), async (req, res) => {
  const { id, caId } = req.params;
  const updated = await Business.findByIdAndUpdate(id, { assignedCA: caId }, { new: true });
  return res.json(updated);
});

// ----------------------------------------------------------------------------
// Chart of Accounts
// ----------------------------------------------------------------------------
app.post('/coa', auth, async (req, res) => {
  try {
    const body = { ...req.body, business: req.user.biz || req.body.business };
    const acc = await ChartAccount.create(body);
    return res.status(201).json(acc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

app.get('/coa', auth, async (req, res) => {
  const list = await ChartAccount.find({ business: req.user.biz }).lean();
  return res.json(list);
});

// ----------------------------------------------------------------------------
// Transactions (Income/Expense + receipts)
// ----------------------------------------------------------------------------
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
});

// ----------------------------------------------------------------------------
// Bank Reconciliation (upload CSV -> create BankTxn records; simple match)
// ----------------------------------------------------------------------------
app.post('/bank/upload', auth, upload.single('csv'), async (req, res) => {
  // Here you would parse CSV and create BankTxn documents.
  // For demo, pretend we inserted a couple of rows.
  const demoRows = [
    { bankRef: 'R1', date: new Date(), amount: 5000, description: 'Client payment' },
    { bankRef: 'R2', date: new Date(), amount: -1200, description: 'Office rent' },
  ];
  const created = await BankTxn.insertMany(
    demoRows.map((r) => ({ ...r, business: req.user.biz }))
  );
  return res.status(201).json({ inserted: created.length });
});

app.post('/bank/match/:bankTxnId/:transactionId', auth, async (req, res) => {
  const { bankTxnId, transactionId } = req.params;
  const bankTxn = await BankTxn.findByIdAndUpdate(
    bankTxnId,
    { matchedTransaction: transactionId },
    { new: true }
  );
  return res.json(bankTxn);
});

app.get('/bank/unmatched', auth, async (req, res) => {
  const list = await BankTxn.find({ business: req.user.biz, matchedTransaction: null }).lean();
  return res.json(list);
});

// ----------------------------------------------------------------------------
// Invoicing (GST calc + PDF url placeholder + recurring stub)
// ----------------------------------------------------------------------------
function computeInvoiceTotals(inv) {
  const sub = inv.items.reduce((s, it) => s + it.qty * it.price, 0);
  const gst = inv.items.reduce((s, it) => s + (it.qty * it.price * (it.gstRate || 0)) / 100, 0);
  const total = sub + gst;
  return { subTotal: sub, gstTotal: gst, grandTotal: total };
}

app.post('/invoices', auth, async (req, res) => {
  try {
    const inv = await Invoice.create({ ...req.body, business: req.user.biz, issueDate: new Date() });
    const totals = computeInvoiceTotals(inv);
    return res.status(201).json({ invoice: inv, totals });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

app.get('/invoices', auth, async (req, res) => {
  const list = await Invoice.find({ business: req.user.biz }).sort({ createdAt: -1 }).lean();
  // attach totals per invoice
  return res.json(list.map((inv) => ({ ...inv, totals: computeInvoiceTotals(inv) })));
});

app.post('/invoices/:id/mark-paid', auth, async (req, res) => {
  const { id } = req.params;
  const updated = await Invoice.findByIdAndUpdate(id, { status: 'PAID' }, { new: true });
  return res.json(updated);
});

// Recurring invoices (stub): store a template with interval, a CRON job would emit invoices
const RecurringTemplate = mongoose.model(
  'RecurringTemplate',
  new mongoose.Schema(
    {
      business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
      template: Object, // shape similar to Invoice
      everyDays: Number, // e.g., 30 for monthly
      nextRun: Date,
    },
    { timestamps: true }
  )
);

app.post('/invoices/recurring', auth, async (req, res) => {
  const tpl = await RecurringTemplate.create({
    business: req.user.biz,
    template: req.body.template,
    everyDays: req.body.everyDays || 30,
    nextRun: dayjs().add(req.body.everyDays || 30, 'day').toDate(),
  });
  return res.status(201).json(tpl);
});

app.get('/invoices/recurring', auth, async (req, res) => {
  try {
    // Support filtering by business ID (for CA viewing client data)
    const businessId = req.query.business || req.user.biz;
    const templates = await RecurringTemplate.find({ business: businessId })
      .populate('business', 'name')
      .sort({ createdAt: -1 })
      .lean();
    return res.json(templates);
  } catch (error) {
    console.error('Error fetching recurring templates:', error);
    return res.status(500).json({ message: error.message });
  }
});

// ----------------------------------------------------------------------------
// Reports (very simplified aggregations)
// ----------------------------------------------------------------------------
app.get('/reports/profit-loss', auth, async (req, res) => {
  const { from, to } = req.query;
  const match = { business: req.user.biz };
  if (from || to) match.date = {};
  if (from) match.date.$gte = new Date(from);
  if (to) match.date.$lte = new Date(to);

  const txns = await Transaction.find(match).lean();
  const income = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const profit = income - expense;
  return res.json({ income, expense, profit });
});

// Monthly financial data for charts
app.get('/api/dashboard/chart-data', auth, async (req, res) => {
  try {
    const currentDate = dayjs();
    const monthsData = [];
    
    // Get data for last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthStart = currentDate.subtract(i, 'months').startOf('month');
      const monthEnd = monthStart.endOf('month');
      
      const txns = await Transaction.find({
        business: req.user.biz,
        date: { $gte: monthStart.toDate(), $lte: monthEnd.toDate() },
      }).lean();

      const income = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
      const expenses = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
      const profit = income - expenses;
      
      monthsData.push({
        month: monthStart.format('MMM'),
        income,
        expenses,
        profit,
        growth: i === 11 ? 0 : monthsData.length > 0 ? 
          ((income - monthsData[monthsData.length - 1]?.income || 0) / (monthsData[monthsData.length - 1]?.income || 1)) * 100 : 0
      });
    }

    return res.json({ monthlyData: monthsData });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

app.get('/reports/gst-summary', auth, async (req, res) => {
  const { period } = req.query; // e.g., 2025-07
  const start = period ? dayjs(`${period}-01`) : dayjs().startOf('month');
  const end = start.endOf('month');
  const txns = await Transaction.find({
    business: req.user.biz,
    date: { $gte: start.toDate(), $lte: end.toDate() },
    'gst.amount': { $exists: true },
  }).lean();

  // Output GST = on sales (amount > 0 and not input)
  const outputGST = txns
    .filter((t) => t.amount > 0 && !(t.gst?.input))
    .reduce((s, t) => s + (t.gst?.amount || 0), 0);
  // Input GST = on purchases/expenses (amount < 0 and input)
  const inputGST = txns
    .filter((t) => t.amount < 0 && t.gst?.input)
    .reduce((s, t) => s + (t.gst?.amount || 0), 0);

  const netLiability = Math.max(0, outputGST - inputGST);
  return res.json({ period: start.format('YYYY-MM'), outputGST, inputGST, netLiability });
});

app.get('/reports/balance-sheet', auth, async (req, res) => {
  // Very naive: sum by COA type from journal entries (debit - credit for assets/expenses)
  const entries = await JournalEntry.find({ business: req.user.biz }).populate('lines.account').lean();
  const totals = { ASSET: 0, LIABILITY: 0, INCOME: 0, EXPENSE: 0 };
  for (const je of entries) {
    for (const line of je.lines) {
      const type = line.account?.type;
      if (!type) continue;
      const delta = (line.debit || 0) - (line.credit || 0);
      totals[type] += delta;
    }
  }
  return res.json(totals);
});

// ----------------------------------------------------------------------------
// Tax & Compliance (uploads + simple calculators)
// ----------------------------------------------------------------------------
app.post('/tax/upload', auth, upload.single('file'), async (req, res) => {
  const { type, period } = req.body;
  const rec = await ReturnUpload.create({
    business: req.user.biz,
    type,
    period,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  });
  return res.status(201).json(rec);
});

app.get('/tax/tds-calc', auth, async (req, res) => {
  // Simple: TDS = amount * rate%
  const { amount, rate } = req.query;
  const tds = (Number(amount) * Number(rate)) / 100;
  return res.json({ amount: Number(amount), rate: Number(rate), tds });
});

app.get('/tax/income-tax-estimate', auth, async (req, res) => {
  // Super simplified estimate based on annual profit
  const { fy } = req.query; // financial year label
  const start = dayjs().startOf('year'); // placeholder
  const end = dayjs().endOf('year');
  const txns = await Transaction.find({ business: req.user.biz, date: { $gte: start.toDate(), $lte: end.toDate() } }).lean();
  const income = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const profit = income - expense;
  // Flat placeholder rate 25% with 4% cess
  const tax = profit > 0 ? profit * 0.25 * 1.04 : 0;
  return res.json({ fy: fy || 'current', profit, estimatedTax: Math.round(tax) });
});

// ----------------------------------------------------------------------------
// Dashboard (control center)
// ----------------------------------------------------------------------------
app.get('/dashboard', auth, async (req, res) => {
  const today = dayjs();
  const start = today.startOf('month');
  const txns = await Transaction.find({
    business: req.user.biz,
    date: { $gte: start.toDate(), $lte: today.toDate() },
  }).lean();

  const income = txns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const invoices = await Invoice.find({ business: req.user.biz }).lean();
  const outstanding = invoices.filter((i) => i.status !== 'PAID').length;

  // Dummy GST deadline examples (1st and 20th of next month)
  const deadlines = [
    { label: 'GSTR-1', due: today.add(1, 'month').date(11).format('YYYY-MM-DD') },
    { label: 'GSTR-3B', due: today.add(1, 'month').date(20).format('YYYY-MM-DD') },
  ];

  return res.json({
    period: { from: start.format('YYYY-MM-DD'), to: today.format('YYYY-MM-DD') },
    totals: { income, expense, net: income - expense },
    transactions: { count: txns.length, change: 23 },
    deadlines,
    outstandingInvoices: outstanding,
    health: (income - expense) >= 0 ? 'GOOD' : 'ATTENTION',
  });
});

// ----------------------------------------------------------------------------
// Document Sharing (secure collaboration)
// ----------------------------------------------------------------------------
app.post('/docs/share', auth, upload.single('file'), async (req, res) => {
  const { notes, sharedWith } = req.body;
  const share = await DocShare.create({
    business: req.user.biz,
    uploader: req.user.id,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    notes,
    sharedWith: sharedWith ? sharedWith.split(',') : [],
  });
  return res.status(201).json(share);
});

app.get('/docs/shared', auth, async (req, res) => {
  const docs = await DocShare.find({ business: req.user.biz })
    .populate('uploader', 'name email')
    .populate('sharedWith', 'name email')
    .lean();
  return res.json(docs);
});

// ----------------------------------------------------------------------------
// Server
// ----------------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.use('/uploads', express.static('uploads'));
app.get('/', (_, res) => res.send('Accounting/GST backend is running ✔'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

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

// User Tax Data Routes (for Combined Tax Calculator)
app.get('/api/user/:userId/tax-data', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📊 Fetching tax data for user:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user tax data or defaults if empty
    const taxData = user.taxData || {
      annualIncome: 0,
      taxRegime: 'new',
      section80C: 0,
      section80D: 0,
      section80G: 0,
      section80E: 0,
      section80EE: 0,
      section80GGC: 0,
      otherDeductions: 0,
      taxBeforeInvestments: 0,
      taxAfterInvestments: 0,
      totalTaxSaved: 0,
      estimatedAnnualTax: 0,
      advanceTaxPaid: 0,
      nextDueDate: '',
      paymentReminders: []
    };
    
    res.json({ success: true, taxData });
  } catch (error) {
    console.error('Error fetching user tax data:', error);
    res.status(500).json({ message: 'Error fetching tax data', error: error.message });
  }
});

app.put('/api/user/:userId/tax-data', async (req, res) => {
  try {
    const { userId } = req.params;
    const taxData = req.body;
    
    console.log('💾 Updating tax data for user:', userId);
    console.log('Tax data received:', taxData);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user tax data
    user.taxData = {
      ...user.taxData,
      ...taxData,
      lastCalculatedAt: new Date()
    };
    
    await user.save();
    
    res.json({ success: true, message: 'Tax data updated successfully', taxData: user.taxData });
  } catch (error) {
    console.error('Error updating user tax data:', error);
    res.status(500).json({ message: 'Error updating tax data', error: error.message });
  }
});

// P&L Statement PDF Generation
app.get('/api/reports/profit-loss/pdf', auth, async (req, res) => {
  console.log('📊 P&L PDF request received');
  try {
    const { generateProfitLossPDF } = require('./utils/profitLossPdfGenerator');
    
    // Sample P&L data - you can modify this to fetch from your database
    const reportData = {
      businessName: req.query.businessName || 'Sample Business',
      periodDescription: req.query.period || 'October 2025 Profit & Loss (Last 3 Months)',
      revenue: [
        { account: 'service-income', amount: 100001 },
        { account: 'interest-income', amount: 114222 }
      ],
      expenses: [
        { account: 'office-supplies', amount: 25000 },
        { account: 'rent-expense', amount: 30000 },
        { account: 'utilities', amount: 8500 },
        { account: 'marketing', amount: 15000 }
      ]
    };
    
    console.log('📋 Generating PDF with data:', reportData);
    const pdf = await generateProfitLossPDF(reportData);
    console.log('✅ PDF generated successfully, size:', pdf.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="profit-loss-statement-${Date.now()}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('❌ P&L PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate P&L PDF',
      message: error.message 
    });
  }
});

// Balance Sheet Test endpoint
app.get('/api/reports/balance-sheet/test', (req, res) => {
  console.log('📊 Balance Sheet test request received');
  res.json({ message: 'Balance Sheet endpoint works!', timestamp: new Date().toISOString() });
});

// Balance Sheet PDF Generation
app.get('/api/reports/balance-sheet/pdf', async (req, res) => {
  console.log('📊 Balance Sheet PDF request received');
  try {
    const { generateBalanceSheetPDF } = require('./utils/balanceSheetPdfGenerator');
    
    // Sample Balance Sheet data - you can modify this to fetch from your database
    const reportData = {
      businessName: req.query.businessName || 'Sample Business',
      asOfDate: req.query.asOfDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentAssets: [
        { name: 'Cash in Hand', amount: 50000 },
        { name: 'Bank Account', amount: 385000 },
        { name: 'Accounts Receivable', amount: 125000 },
        { name: 'Inventory', amount: 85000 }
      ],
      fixedAssets: [
        { name: 'Office Equipment', amount: 150000 },
        { name: 'Furniture & Fixtures', amount: 75000 },
        { name: 'Computer Systems', amount: 120000 }
      ],
      currentLiabilities: [
        { name: 'Accounts Payable', amount: 45000 },
        { name: 'Short Term Loans', amount: 25000 },
        { name: 'Accrued Expenses', amount: 15000 }
      ],
      longTermLiabilities: [
        { name: 'Long Term Loan', amount: 200000 },
        { name: 'Equipment Loan', amount: 50000 }
      ],
      equity: [
        { name: 'Owner Equity', amount: 400000 },
        { name: 'Retained Earnings', amount: 255000 }
      ]
    };
    
    console.log('📋 Generating Balance Sheet PDF with data:', reportData);
    const pdf = await generateBalanceSheetPDF(reportData);
    console.log('✅ Balance Sheet PDF generated successfully, size:', pdf.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="balance-sheet-${Date.now()}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('❌ Balance Sheet PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate Balance Sheet PDF',
      message: error.message 
    });
  }
});

// Balance Sheet Excel Generation
app.get('/api/reports/balance-sheet/excel', async (req, res) => {
  console.log('📊 Balance Sheet Excel request received');
  try {
    const { generateBalanceSheetExcel } = require('./utils/balanceSheetExcelGenerator');
    
    // Sample Balance Sheet data - same as PDF route
    const reportData = {
      businessName: req.query.businessName || 'Sample Business',
      asOfDate: req.query.asOfDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentAssets: [
        { name: 'Cash in Hand', amount: 50000 },
        { name: 'Bank Account', amount: 385000 },
        { name: 'Accounts Receivable', amount: 125000 },
        { name: 'Inventory', amount: 85000 }
      ],
      fixedAssets: [
        { name: 'Office Equipment', amount: 150000 },
        { name: 'Furniture & Fixtures', amount: 75000 },
        { name: 'Computer Systems', amount: 120000 }
      ],
      currentLiabilities: [
        { name: 'Accounts Payable', amount: 45000 },
        { name: 'Short Term Loans', amount: 25000 },
        { name: 'Accrued Expenses', amount: 15000 }
      ],
      longTermLiabilities: [
        { name: 'Long Term Loan', amount: 200000 },
        { name: 'Equipment Loan', amount: 50000 }
      ],
      equity: [
        { name: 'Owner Equity', amount: 400000 },
        { name: 'Retained Earnings', amount: 255000 }
      ]
    };
    
    // Chart data for visualization (optional - can be derived from reportData)
    const chartData = {
      totalAssets: 890000,
      totalLiabilities: 335000,
      totalEquity: 655000
    };
    
    console.log('📋 Generating Balance Sheet Excel with data:', reportData);
    const workbook = await generateBalanceSheetExcel(reportData, chartData);
    
    // Convert workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    console.log('✅ Balance Sheet Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="balance-sheet-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ Balance Sheet Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate Balance Sheet Excel',
      message: error.message 
    });
  }
});

// Cash Flow Test endpoint
app.get('/api/reports/cash-flow/test', (req, res) => {
  console.log('💰 Cash Flow test request received');
  res.json({ message: 'Cash Flow endpoint works!', timestamp: new Date().toISOString() });
});

// Cash Flow PDF Generation
app.get('/api/reports/cash-flow/pdf', async (req, res) => {
  console.log('💰 Cash Flow PDF request received');
  try {
    const { generateCashFlowPDF } = require('./utils/cashFlowPdfGenerator');
    
    // Sample Cash Flow data - you can modify this to fetch from your database
    const reportData = {
      businessName: req.query.businessName || 'Sample Business',
      periodEnding: req.query.periodEnding || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      operatingActivities: [
        { name: 'Net Income', amount: 450000 },
        { name: 'Depreciation', amount: 25000 },
        { name: 'Accounts Receivable', amount: -15000 },
        { name: 'Accounts Payable', amount: 8000 },
        { name: 'Inventory', amount: -12000 }
      ],
      investingActivities: [
        { name: 'Equipment Purchase', amount: -75000 },
        { name: 'Investment Sale', amount: 20000 }
      ],
      financingActivities: [
        { name: 'Loan Repayment', amount: -30000 },
        { name: 'Dividend Payment', amount: -25000 }
      ]
    };
    
    console.log('💰 Generating Cash Flow PDF with data:', reportData);
    
    const pdf = await generateCashFlowPDF(reportData);
    
    console.log('✅ Cash Flow PDF generated successfully, size:', pdf.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="cash-flow-statement-${Date.now()}.pdf"`);
    res.send(pdf);
  } catch (error) {
    console.error('❌ Cash Flow PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate Cash Flow PDF',
      message: error.message 
    });
  }
});

// Cash Flow Excel Generation
app.get('/api/reports/cash-flow/excel', async (req, res) => {
  console.log('💰 Cash Flow Excel request received');
  try {
    const { generateCashFlowExcel } = require('./utils/cashFlowExcelGenerator');
    
    // Sample Cash Flow data - same as PDF route
    const reportData = {
      businessName: req.query.businessName || 'Sample Business',
      periodEnding: req.query.periodEnding || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      operatingActivities: [
        { name: 'Net Income', amount: 450000 },
        { name: 'Depreciation', amount: 25000 },
        { name: 'Accounts Receivable', amount: -15000 },
        { name: 'Accounts Payable', amount: 8000 },
        { name: 'Inventory', amount: -12000 }
      ],
      investingActivities: [
        { name: 'Equipment Purchase', amount: -75000 },
        { name: 'Investment Sale', amount: 20000 }
      ],
      financingActivities: [
        { name: 'Loan Repayment', amount: -30000 },
        { name: 'Dividend Payment', amount: -25000 }
      ]
    };
    
    console.log('💰 Generating Cash Flow Excel with data:', reportData);
    
    const buffer = await generateCashFlowExcel(reportData);
    
    console.log('✅ Cash Flow Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="cash-flow-statement-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ Cash Flow Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate Cash Flow Excel',
      message: error.message 
    });
  }
});

// --------------------- Tax Reports API ---------------------
const { generateGSTReportPDF } = require('./utils/gstReportPdfGenerator');
const { generateGSTReportExcel } = require('./utils/gstReportExcelGenerator');

// GST Report PDF endpoint
app.get('/api/reports/tax/gst/pdf', async (req, res) => {
  try {
    console.log('🏛️ GST Report PDF generation requested');
    
    const reportData = {
      businessName: 'Sample Business Pvt Ltd',
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 45600,
      gstPaid: 12800,
      tdsDeducted: 8500,
      pendingReturns: 2,
      gstSummary: [
        { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
        { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
        { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' },
        { period: 'September 2024', sales: 198000, gstCollected: 35640, gstPaid: 15800, netGST: 19840, status: 'Filed' },
        { period: 'August 2024', sales: 212000, gstCollected: 38160, gstPaid: 16200, netGST: 21960, status: 'Filed' }
      ],
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
      ]
    };
    
    console.log('📊 Generating GST Report PDF with data:', reportData);
    
    const buffer = await generateGSTReportPDF(reportData);
    
    console.log('✅ GST Report PDF generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="gst-tax-report-${Date.now()}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ GST Report PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate GST Report PDF',
      message: error.message 
    });
  }
});

// GST Report Excel endpoint  
app.get('/api/reports/tax/gst/excel', async (req, res) => {
  try {
    console.log('📋 GST Report Excel generation requested');
    
    const reportData = {
      businessName: 'Sample Business Pvt Ltd',
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 45600,
      gstPaid: 12800,
      tdsDeducted: 8500,
      pendingReturns: 2,
      gstSummary: [
        { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
        { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
        { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' },
        { period: 'September 2024', sales: 198000, gstCollected: 35640, gstPaid: 15800, netGST: 19840, status: 'Filed' },
        { period: 'August 2024', sales: 212000, gstCollected: 38160, gstPaid: 16200, netGST: 21960, status: 'Filed' }
      ],
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
      ]
    };
    
    console.log('💰 Generating GST Report Excel with data:', reportData);
    
    const buffer = await generateGSTReportExcel(reportData);
    
    console.log('✅ GST Report Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="gst-tax-report-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ GST Report Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate GST Report Excel',
      message: error.message 
    });
  }
});

// TDS Report PDF endpoint (using GST generator for now)
app.get('/api/reports/tax/tds/pdf', async (req, res) => {
  try {
    console.log('🏛️ TDS Report PDF generation requested');
    
    const reportData = {
      businessName: 'Sample Business PvLtd',
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 0, // TDS focused report
      gstPaid: 0,
      tdsDeducted: 57500, // Focus on TDS
      pendingReturns: 1,
      gstSummary: [], // Empty for TDS report
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' },
        { quarter: 'Q4 2023', totalPayments: 295000, tdsDeducted: 14750, tdsDeposited: 14750, dueDate: '2024-04-07', status: 'Filed' }
      ]
    };
    
    console.log('📊 Generating TDS Report PDF with data:', reportData);
    
    const buffer = await generateGSTReportPDF(reportData); // Reusing GST generator for TDS
    
    console.log('✅ TDS Report PDF generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="tds-tax-report-${Date.now()}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ TDS Report PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate TDS Report PDF',
      message: error.message 
    });
  }
});

// TDS Report Excel endpoint (using GST generator for now)
app.get('/api/reports/tax/tds/excel', async (req, res) => {
  try {
    console.log('📋 TDS Report Excel generation requested');
    
    const reportData = {
      businessName: 'Sample Business PvLtd', 
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 0, // TDS focused report
      gstPaid: 0,
      tdsDeducted: 57500, // Focus on TDS
      pendingReturns: 1,
      gstSummary: [], // Empty for TDS report
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' },
        { quarter: 'Q4 2023', totalPayments: 295000, tdsDeducted: 14750, tdsDeposited: 14750, dueDate: '2024-04-07', status: 'Filed' }
      ]
    };
    
    console.log('💰 Generating TDS Report Excel with data:', reportData);
    
    const buffer = await generateGSTReportExcel(reportData); // Reusing GST generator for TDS
    
    console.log('✅ TDS Report Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="tds-tax-report-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ TDS Report Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate TDS Report Excel',
      message: error.message 
    });
  }
});

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

// Graceful shutdown - temporarily disabled for testing
// process.on('SIGINT', async () => {
//   console.log('Shutting down gracefully...');
//   try {
//     const pdfGenerator = require('./utils/pdfGenerator');
//     await pdfGenerator.closeBrowser();
//   } catch (error) {
//     console.error('Error during shutdown:', error);
//   }
//   process.exit(0);
// });

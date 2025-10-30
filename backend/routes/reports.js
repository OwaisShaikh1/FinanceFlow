const express = require('express');
const router = express.Router();

// JWT auth middleware
const jwt = require('jsonwebtoken');
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

// P&L Statement PDF Generation
router.get('/profit-loss/pdf', auth, async (req, res) => {
  console.log('📊 P&L PDF request received');
  try {
    const { generateProfitLossPDF } = require('../utils/profitLossPdfGenerator');
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Get query parameters
    const { businessName, period, clientId, businessId, startDate, endDate } = req.query;
    
    // Determine which business to query
    let targetBusinessId = businessId;
    let actualBusinessName = businessName || 'Business';
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (user) {
        const business = await Business.findOne({ owner: user._id });
        if (business) {
          targetBusinessId = business._id;
          actualBusinessName = business.name || user.name || 'Business';
        }
      }
    }
    
    // Default to last 3 months if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth() - 3, 1);
    
    // Fetch transactions for the period
    const query = {
      date: { $gte: start, $lte: end }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query);
    console.log(`Found ${transactions.length} transactions for P&L report`);
    
    // Calculate revenue and expenses from transactions
    const revenueMap = new Map();
    const expenseMap = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      
      if (type === 'income') {
        revenueMap.set(category, (revenueMap.get(category) || 0) + amount);
      } else if (type === 'expense') {
        expenseMap.set(category, (expenseMap.get(category) || 0) + amount);
      }
    });
    
    // Convert maps to arrays
    const revenue = Array.from(revenueMap.entries()).map(([account, amount]) => ({
      account: account.toLowerCase().replace(/\s+/g, '-'),
      amount: Math.round(amount)
    }));
    
    const expenses = Array.from(expenseMap.entries()).map(([account, amount]) => ({
      account: account.toLowerCase().replace(/\s+/g, '-'),
      amount: Math.round(amount)
    }));
    
    // If no data, provide defaults
    if (revenue.length === 0) {
      revenue.push({ account: 'no-income', amount: 0 });
    }
    if (expenses.length === 0) {
      expenses.push({ account: 'no-expenses', amount: 0 });
    }
    
    const reportData = {
      businessName: actualBusinessName,
      periodDescription: period || `Profit & Loss Statement (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`,
      revenue,
      expenses
    };
    
    console.log('📋 Generating PDF with real data:', {
      business: actualBusinessName,
      revenueItems: revenue.length,
      expenseItems: expenses.length,
      totalRevenue: revenue.reduce((sum, r) => sum + r.amount, 0),
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0)
    });
    
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

// P&L Excel Generation
router.get('/profit-loss/excel', auth, async (req, res) => {
  console.log('📊 P&L Excel request received');
  try {
    const excelGenerator = require('../utils/excelGenerator');
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Get query parameters
    const { businessName, period, clientId, businessId, startDate, endDate } = req.query;
    
    // Determine which business to query
    let targetBusinessId = businessId;
    let actualBusinessName = businessName || 'Business';
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (user) {
        const business = await Business.findOne({ owner: user._id });
        if (business) {
          targetBusinessId = business._id;
          actualBusinessName = business.name || user.name || 'Business';
        }
      }
    }
    
    // Default to last 3 months if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth() - 3, 1);
    
    // Fetch transactions for the period
    const query = {
      date: { $gte: start, $lte: end }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query);
    console.log(`Found ${transactions.length} transactions for P&L Excel`);
    
    // Calculate revenue and expenses from transactions
    const revenueMap = new Map();
    const expenseMap = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      
      if (type === 'income') {
        revenueMap.set(category, (revenueMap.get(category) || 0) + amount);
      } else if (type === 'expense') {
        expenseMap.set(category, (expenseMap.get(category) || 0) + amount);
      }
    });
    
    // Convert maps to arrays
    const revenue = Array.from(revenueMap.entries()).map(([account, amount]) => ({
      account: account.toLowerCase().replace(/\s+/g, '-'),
      amount: Math.round(amount)
    }));
    
    const expenses = Array.from(expenseMap.entries()).map(([account, amount]) => ({
      account: account.toLowerCase().replace(/\s+/g, '-'),
      amount: Math.round(amount)
    }));
    
    // If no data, provide defaults
    if (revenue.length === 0) {
      revenue.push({ account: 'no-income', amount: 0 });
    }
    if (expenses.length === 0) {
      expenses.push({ account: 'no-expenses', amount: 0 });
    }
    
    const reportData = {
      businessName: actualBusinessName,
      periodDescription: period || `Profit & Loss Statement (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`,
      revenue,
      expenses
    };
    
    console.log('📋 Generating P&L Excel with real data:', {
      business: actualBusinessName,
      revenueItems: revenue.length,
      expenseItems: expenses.length,
      totalRevenue: revenue.reduce((sum, r) => sum + r.amount, 0),
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0)
    });
    
    const buffer = await excelGenerator.generateFinancialReport(reportData, 'profit-loss');
    console.log('✅ P&L Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="profit-loss-statement-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ P&L Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate P&L Excel',
      message: error.message 
    });
  }
});

// Balance Sheet Test endpoint
router.get('/balance-sheet/test', (req, res) => {
  console.log('📊 Balance Sheet test request received');
  res.json({ message: 'Balance Sheet endpoint works!', timestamp: new Date().toISOString() });
});

// Balance Sheet PDF Generation
router.get('/balance-sheet/pdf', auth, async (req, res) => {
  console.log('📊 Balance Sheet PDF request received');
  try {
    const { generateBalanceSheetPDF } = require('../utils/balanceSheetPdfGenerator');
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Get query parameters
    const { businessName, asOfDate, clientId, businessId } = req.query;
    
    // Determine which business to query
    let targetBusinessId = businessId;
    let actualBusinessName = businessName || 'Business';
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (user) {
        const business = await Business.findOne({ owner: user._id });
        if (business) {
          targetBusinessId = business._id;
          actualBusinessName = business.name || user.name || 'Business';
        }
      }
    }
    
    // Default to current date if not provided
    const endDate = asOfDate ? new Date(asOfDate) : new Date();
    
    // Fetch all transactions up to the specified date
    const query = {
      date: { $lte: endDate }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    console.log(`Found ${transactions.length} transactions for Balance Sheet`);
    
    // Initialize balance sheet structure
    const balanceSheet = {
      currentAssets: [],
      fixedAssets: [],
      currentLiabilities: [],
      longTermLiabilities: [],
      equity: []
    };
    
    // Group transactions by category and calculate balances
    const accountBalances = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      
      if (!accountBalances.has(category)) {
        accountBalances.set(category, {
          name: category,
          balance: 0,
          type: type
        });
      }
      
      const account = accountBalances.get(category);
      
      if (type === 'income') {
        account.balance += amount;
      } else if (type === 'expense') {
        account.balance -= amount;
      }
    });
    
    // Categorize accounts into balance sheet sections
    accountBalances.forEach((account, category) => {
      const categoryLower = category.toLowerCase();
      const amount = Math.abs(account.balance);
      
      const item = { name: category, amount: Math.round(amount) };
      
      if (account.type === 'income' && account.balance > 0) {
        balanceSheet.equity.push(item);
      } else if (account.type === 'expense' && account.balance < 0) {
        if (categoryLower.includes('equipment') || categoryLower.includes('furniture') || 
            categoryLower.includes('vehicle') || categoryLower.includes('building')) {
          balanceSheet.fixedAssets.push(item);
        } else {
          balanceSheet.currentAssets.push(item);
        }
      } else if (account.balance < 0) {
        if (categoryLower.includes('loan') || categoryLower.includes('mortgage')) {
          balanceSheet.longTermLiabilities.push(item);
        } else {
          balanceSheet.currentLiabilities.push(item);
        }
      }
    });
    
    // Add defaults if empty
    if (balanceSheet.currentAssets.length === 0) {
      balanceSheet.currentAssets.push({ name: 'Cash & Bank', amount: 0 });
    }
    if (balanceSheet.equity.length === 0) {
      balanceSheet.equity.push({ name: 'Owner Equity', amount: 0 });
    }
    
    const reportData = {
      businessName: actualBusinessName,
      asOfDate: endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentAssets: balanceSheet.currentAssets,
      fixedAssets: balanceSheet.fixedAssets,
      currentLiabilities: balanceSheet.currentLiabilities,
      longTermLiabilities: balanceSheet.longTermLiabilities,
      equity: balanceSheet.equity
    };
    
    console.log('📋 Generating Balance Sheet PDF with real data:', {
      business: actualBusinessName,
      currentAssets: balanceSheet.currentAssets.length,
      fixedAssets: balanceSheet.fixedAssets.length,
      currentLiabilities: balanceSheet.currentLiabilities.length,
      longTermLiabilities: balanceSheet.longTermLiabilities.length,
      equity: balanceSheet.equity.length
    });
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
router.get('/balance-sheet/excel', auth, async (req, res) => {
  console.log('📊 Balance Sheet Excel request received');
  try {
    const { generateBalanceSheetExcel } = require('../utils/balanceSheetExcelGenerator');
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Get query parameters (same logic as PDF route)
    const { businessName, asOfDate, clientId, businessId } = req.query;
    
    // Determine which business to query
    let targetBusinessId = businessId;
    let actualBusinessName = businessName || 'Business';
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (user) {
        const business = await Business.findOne({ owner: user._id });
        if (business) {
          targetBusinessId = business._id;
          actualBusinessName = business.name || user.name || 'Business';
        }
      }
    }
    
    // Default to current date if not provided
    const endDate = asOfDate ? new Date(asOfDate) : new Date();
    
    // Fetch all transactions up to the specified date
    const query = {
      date: { $lte: endDate }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    console.log(`Found ${transactions.length} transactions for Balance Sheet Excel`);
    
    // Initialize balance sheet structure
    const balanceSheet = {
      currentAssets: [],
      fixedAssets: [],
      currentLiabilities: [],
      longTermLiabilities: [],
      equity: []
    };
    
    // Group transactions by category and calculate balances
    const accountBalances = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      
      if (!accountBalances.has(category)) {
        accountBalances.set(category, {
          name: category,
          balance: 0,
          type: type
        });
      }
      
      const account = accountBalances.get(category);
      
      if (type === 'income') {
        account.balance += amount;
      } else if (type === 'expense') {
        account.balance -= amount;
      }
    });
    
    // Categorize accounts into balance sheet sections
    accountBalances.forEach((account, category) => {
      const categoryLower = category.toLowerCase();
      const amount = Math.abs(account.balance);
      
      const item = { name: category, amount: Math.round(amount) };
      
      if (account.type === 'income' && account.balance > 0) {
        balanceSheet.equity.push(item);
      } else if (account.type === 'expense' && account.balance < 0) {
        if (categoryLower.includes('equipment') || categoryLower.includes('furniture') || 
            categoryLower.includes('vehicle') || categoryLower.includes('building')) {
          balanceSheet.fixedAssets.push(item);
        } else {
          balanceSheet.currentAssets.push(item);
        }
      } else if (account.balance < 0) {
        if (categoryLower.includes('loan') || categoryLower.includes('mortgage')) {
          balanceSheet.longTermLiabilities.push(item);
        } else {
          balanceSheet.currentLiabilities.push(item);
        }
      }
    });
    
    // Add defaults if empty
    if (balanceSheet.currentAssets.length === 0) {
      balanceSheet.currentAssets.push({ name: 'Cash & Bank', amount: 0 });
    }
    if (balanceSheet.equity.length === 0) {
      balanceSheet.equity.push({ name: 'Owner Equity', amount: 0 });
    }
    
    const reportData = {
      businessName: actualBusinessName,
      asOfDate: endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentAssets: balanceSheet.currentAssets,
      fixedAssets: balanceSheet.fixedAssets,
      currentLiabilities: balanceSheet.currentLiabilities,
      longTermLiabilities: balanceSheet.longTermLiabilities,
      equity: balanceSheet.equity
    };
    
    // Calculate chart data from real data
    const totalCurrentAssets = balanceSheet.currentAssets.reduce((sum, item) => sum + item.amount, 0);
    const totalFixedAssets = balanceSheet.fixedAssets.reduce((sum, item) => sum + item.amount, 0);
    const totalCurrentLiabilities = balanceSheet.currentLiabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalLongTermLiabilities = balanceSheet.longTermLiabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0);
    
    const chartData = {
      totalAssets: totalCurrentAssets + totalFixedAssets,
      totalLiabilities: totalCurrentLiabilities + totalLongTermLiabilities,
      totalEquity: totalEquity
    };
    
    console.log('📋 Generating Balance Sheet Excel with real data:', {
      business: actualBusinessName,
      totalAssets: chartData.totalAssets,
      totalLiabilities: chartData.totalLiabilities,
      totalEquity: chartData.totalEquity
    });
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
router.get('/cash-flow/test', (req, res) => {
  console.log('💰 Cash Flow test request received');
  res.json({ message: 'Cash Flow endpoint works!', timestamp: new Date().toISOString() });
});

// Cash Flow PDF Generation
router.get('/cash-flow/pdf', auth, async (req, res) => {
  console.log('💰 Cash Flow PDF request received');
  try {
    const { generateCashFlowPDF } = require('../utils/cashFlowPdfGenerator');
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Get query parameters
    const { businessName, periodEnding, clientId, businessId, startDate, endDate } = req.query;
    
    // Determine which business to query
    let targetBusinessId = businessId;
    let actualBusinessName = businessName || 'Business';
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (user) {
        const business = await Business.findOne({ owner: user._id });
        if (business) {
          targetBusinessId = business._id;
          actualBusinessName = business.name || user.name || 'Business';
        }
      }
    }
    
    // Default to last 3 months if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth() - 3, 1);
    
    // Fetch transactions for the period
    const query = {
      date: { $gte: start, $lte: end }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    console.log(`Found ${transactions.length} transactions for Cash Flow PDF`);
    
    // Initialize activity arrays
    const operatingActivities = [];
    const investingActivities = [];
    const financingActivities = [];
    
    // Categorize transactions
    const operatingMap = new Map();
    const investingMap = new Map();
    const financingMap = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      const categoryLower = category.toLowerCase();
      
      // Determine activity type based on category
      if (categoryLower.includes('equipment') || categoryLower.includes('asset') || 
          categoryLower.includes('investment') || categoryLower.includes('property')) {
        // Investing Activities
        const current = investingMap.get(category) || 0;
        investingMap.set(category, current + (type === 'expense' ? -amount : amount));
      } else if (categoryLower.includes('loan') || categoryLower.includes('debt') || 
                 categoryLower.includes('equity') || categoryLower.includes('dividend')) {
        // Financing Activities
        const current = financingMap.get(category) || 0;
        financingMap.set(category, current + (type === 'expense' ? -amount : amount));
      } else {
        // Operating Activities (default)
        const current = operatingMap.get(category) || 0;
        operatingMap.set(category, current + (type === 'expense' ? -amount : amount));
      }
    });
    
    // Convert maps to arrays
    operatingMap.forEach((amount, name) => {
      operatingActivities.push({ name, amount: Math.round(amount) });
    });
    investingMap.forEach((amount, name) => {
      investingActivities.push({ name, amount: Math.round(amount) });
    });
    financingMap.forEach((amount, name) => {
      financingActivities.push({ name, amount: Math.round(amount) });
    });
    
    // Add defaults if empty
    if (operatingActivities.length === 0) {
      operatingActivities.push({ name: 'No Operating Activities', amount: 0 });
    }
    if (investingActivities.length === 0) {
      investingActivities.push({ name: 'No Investing Activities', amount: 0 });
    }
    if (financingActivities.length === 0) {
      financingActivities.push({ name: 'No Financing Activities', amount: 0 });
    }
    
    const reportData = {
      businessName: actualBusinessName,
      periodEnding: periodEnding || end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      operatingActivities,
      investingActivities,
      financingActivities
    };
    
    console.log('💰 Generating Cash Flow PDF with real data:', {
      business: actualBusinessName,
      operating: operatingActivities.length,
      investing: investingActivities.length,
      financing: financingActivities.length
    });
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
router.get('/cash-flow/excel', auth, async (req, res) => {
  console.log('💰 Cash Flow Excel request received');
  try {
    const { generateCashFlowExcel } = require('../utils/cashFlowExcelGenerator');
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Get query parameters (same logic as PDF route)
    const { businessName, periodEnding, clientId, businessId, startDate, endDate } = req.query;
    
    // Determine which business to query
    let targetBusinessId = businessId;
    let actualBusinessName = businessName || 'Business';
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (user) {
        const business = await Business.findOne({ owner: user._id });
        if (business) {
          targetBusinessId = business._id;
          actualBusinessName = business.name || user.name || 'Business';
        }
      }
    }
    
    // Default to last 3 months if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth() - 3, 1);
    
    // Fetch transactions for the period
    const query = {
      date: { $gte: start, $lte: end }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    console.log(`Found ${transactions.length} transactions for Cash Flow Excel`);
    
    // Initialize activity arrays
    const operatingActivities = [];
    const investingActivities = [];
    const financingActivities = [];
    
    // Categorize transactions
    const operatingMap = new Map();
    const investingMap = new Map();
    const financingMap = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      const categoryLower = category.toLowerCase();
      
      // Determine activity type based on category
      if (categoryLower.includes('equipment') || categoryLower.includes('asset') || 
          categoryLower.includes('investment') || categoryLower.includes('property')) {
        // Investing Activities
        const current = investingMap.get(category) || 0;
        investingMap.set(category, current + (type === 'expense' ? -amount : amount));
      } else if (categoryLower.includes('loan') || categoryLower.includes('debt') || 
                 categoryLower.includes('equity') || categoryLower.includes('dividend')) {
        // Financing Activities
        const current = financingMap.get(category) || 0;
        financingMap.set(category, current + (type === 'expense' ? -amount : amount));
      } else {
        // Operating Activities (default)
        const current = operatingMap.get(category) || 0;
        operatingMap.set(category, current + (type === 'expense' ? -amount : amount));
      }
    });
    
    // Convert maps to arrays
    operatingMap.forEach((amount, name) => {
      operatingActivities.push({ name, amount: Math.round(amount) });
    });
    investingMap.forEach((amount, name) => {
      investingActivities.push({ name, amount: Math.round(amount) });
    });
    financingMap.forEach((amount, name) => {
      financingActivities.push({ name, amount: Math.round(amount) });
    });
    
    // Add defaults if empty
    if (operatingActivities.length === 0) {
      operatingActivities.push({ name: 'No Operating Activities', amount: 0 });
    }
    if (investingActivities.length === 0) {
      investingActivities.push({ name: 'No Investing Activities', amount: 0 });
    }
    if (financingActivities.length === 0) {
      financingActivities.push({ name: 'No Financing Activities', amount: 0 });
    }
    
    const reportData = {
      businessName: actualBusinessName,
      periodEnding: periodEnding || end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      operatingActivities,
      investingActivities,
      financingActivities
    };
    
    console.log('💰 Generating Cash Flow Excel with real data:', {
      business: actualBusinessName,
      operating: operatingActivities.length,
      investing: investingActivities.length,
      financing: financingActivities.length
    });
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

// ==================== BALANCE SHEET DATA ENDPOINT ====================

router.get('/balance-sheet/data', auth, async (req, res) => {
  try {
    console.log('📊 Balance Sheet Data request received');
    const { businessId, clientId, asOfDate } = req.query;
    
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Determine which business to query
    let targetBusinessId = businessId;
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const business = await Business.findOne({ owner: user._id });
      if (!business) {
        return res.status(404).json({ message: 'Business not found for user' });
      }
      targetBusinessId = business._id;
    }
    
    // Default to current date if not provided
    const endDate = asOfDate ? new Date(asOfDate) : new Date();
    
    console.log('Fetching balance sheet data for business:', targetBusinessId);
    console.log('As of date:', endDate);
    
    // Fetch all transactions up to the specified date
    const query = {
      date: { $lte: endDate }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    
    console.log(`Found ${transactions.length} transactions for balance sheet`);
    
    // Initialize balance sheet structure
    const balanceSheet = {
      currentAssets: [],
      fixedAssets: [],
      currentLiabilities: [],
      longTermLiabilities: [],
      equity: []
    };
    
    // Group transactions by category and calculate balances
    const accountBalances = new Map();
    
    transactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const amount = txn.amount || 0;
      const type = txn.type || 'expense';
      
      if (!accountBalances.has(category)) {
        accountBalances.set(category, {
          name: category,
          balance: 0,
          type: type,
          transactionCount: 0
        });
      }
      
      const account = accountBalances.get(category);
      
      // For income/revenue, add to balance; for expense, subtract
      if (type === 'income') {
        account.balance += amount;
      } else if (type === 'expense') {
        account.balance -= amount;
      }
      
      account.transactionCount++;
    });
    
    // Categorize accounts into balance sheet sections
    // Categorize based on category name first, then type/balance
    accountBalances.forEach((account, category) => {
      const categoryLower = category.toLowerCase();
      const amount = Math.abs(account.balance); // Use absolute values for display
      
      const item = {
        _id: category,
        name: category,
        amount: amount,
        transactionCount: account.transactionCount
      };
      
      // LIABILITIES - Check category name first (most important)
      if (categoryLower.includes('payable') || categoryLower.includes('credit card') || 
          categoryLower.includes('short-term loan') || categoryLower.includes('wages payable') ||
          categoryLower.includes('taxes payable')) {
        item.type = 'current-liability';
        balanceSheet.currentLiabilities.push(item);
      }
      else if (categoryLower.includes('loan') || categoryLower.includes('mortgage') ||
               categoryLower.includes('long-term') || categoryLower.includes('bonds payable')) {
        item.type = 'long-term-liability';
        balanceSheet.longTermLiabilities.push(item);
      }
      // EQUITY - Check for capital, earnings, investment keywords
      else if (categoryLower.includes('capital') || categoryLower.includes('equity') ||
               categoryLower.includes('retained earnings') || categoryLower.includes('investment')) {
        item.type = 'equity';
        balanceSheet.equity.push(item);
      }
      // FIXED ASSETS - Long-term physical assets
      else if (categoryLower.includes('equipment') || categoryLower.includes('furniture') || 
               categoryLower.includes('vehicle') || categoryLower.includes('building') ||
               categoryLower.includes('property') || categoryLower.includes('machinery') ||
               categoryLower.includes('land')) {
        item.type = 'fixed-asset';
        balanceSheet.fixedAssets.push(item);
      }
      // CURRENT ASSETS - Short-term assets
      else if (categoryLower.includes('cash') || categoryLower.includes('bank') ||
               categoryLower.includes('receivable') || categoryLower.includes('inventory') ||
               categoryLower.includes('prepaid')) {
        item.type = 'current-asset';
        balanceSheet.currentAssets.push(item);
      }
      // Fallback categorization based on transaction type
      else if (account.type === 'expense' && account.balance < 0) {
        // Money spent - likely an asset
        item.type = 'current-asset';
        balanceSheet.currentAssets.push(item);
      }
      else if (account.type === 'income' && account.balance > 0) {
        // Money received - could be equity
        item.type = 'equity';
        balanceSheet.equity.push(item);
      }
    });
    
    // Add default items if categories are empty
    if (balanceSheet.currentAssets.length === 0) {
      balanceSheet.currentAssets.push({
        _id: 'default-cash',
        name: 'Cash & Bank',
        amount: 0,
        type: 'current-asset'
      });
    }
    
    if (balanceSheet.equity.length === 0) {
      balanceSheet.equity.push({
        _id: 'default-equity',
        name: 'Owner\'s Equity',
        amount: 0,
        type: 'equity'
      });
    }
    
    // Flatten all items into a single array
    const allItems = [
      ...balanceSheet.currentAssets.map(item => ({ ...item, type: 'current-asset' })),
      ...balanceSheet.fixedAssets.map(item => ({ ...item, type: 'fixed-asset' })),
      ...balanceSheet.currentLiabilities.map(item => ({ ...item, type: 'current-liability' })),
      ...balanceSheet.longTermLiabilities.map(item => ({ ...item, type: 'long-term-liability' })),
      ...balanceSheet.equity.map(item => ({ ...item, type: 'equity' }))
    ];
    
    console.log(`✅ Balance sheet calculated with ${allItems.length} line items`);
    
    res.json({
      success: true,
      data: allItems,
      asOfDate: endDate,
      transactionCount: transactions.length
    });
    
  } catch (error) {
    console.error('❌ Balance Sheet Data error:', error);
    res.status(500).json({ 
      error: 'Failed to generate balance sheet data',
      message: error.message 
    });
  }
});

// ==================== CASH FLOW DATA ENDPOINT ====================

router.get('/cash-flow/data', auth, async (req, res) => {
  try {
    console.log('💰 Cash Flow Data request received');
    const { businessId, clientId, startDate, endDate } = req.query;
    
    const Transaction = require('../models/Transaction');
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Determine which business to query
    let targetBusinessId = businessId;
    
    // If clientId provided, find their business
    if (clientId) {
      const user = await User.findById(clientId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const business = await Business.findOne({ owner: user._id });
      if (!business) {
        return res.status(404).json({ message: 'Business not found for user' });
      }
      targetBusinessId = business._id;
    }
    
    // Default to last 3 months if dates not provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth() - 3, 1);
    
    console.log('Fetching cash flow data for business:', targetBusinessId);
    console.log('Period:', start.toISOString(), 'to', end.toISOString());
    
    // Fetch transactions for the period
    const query = {
      date: { $gte: start, $lte: end }
    };
    
    if (targetBusinessId) {
      query.business = targetBusinessId;
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    
    console.log(`Found ${transactions.length} transactions for cash flow`);
    
    // Initialize cash flow categories
    let operatingInflows = 0;
    let operatingOutflows = 0;
    let investingInflows = 0;
    let investingOutflows = 0;
    let financingInflows = 0;
    let financingOutflows = 0;
    
    const categoryBreakdown = {
      operating: [],
      investing: [],
      financing: []
    };
    
    // Categorize transactions into cash flow activities
    transactions.forEach(txn => {
      const amount = txn.amount || 0;
      const category = (txn.category || 'Uncategorized').toLowerCase();
      const type = txn.type || 'expense';
      
      // Determine cash flow activity type based on category
      if (category.includes('equipment') || category.includes('asset') || 
          category.includes('investment') || category.includes('property')) {
        // Investing Activities
        if (type === 'expense') {
          investingOutflows += amount;
        } else {
          investingInflows += amount;
        }
        categoryBreakdown.investing.push({
          category: txn.category,
          amount: type === 'expense' ? -amount : amount,
          date: txn.date
        });
      } else if (category.includes('loan') || category.includes('debt') || 
                 category.includes('equity') || category.includes('dividend')) {
        // Financing Activities
        if (type === 'expense') {
          financingOutflows += amount;
        } else {
          financingInflows += amount;
        }
        categoryBreakdown.financing.push({
          category: txn.category,
          amount: type === 'expense' ? -amount : amount,
          date: txn.date
        });
      } else {
        // Operating Activities (default)
        if (type === 'expense') {
          operatingOutflows += amount;
        } else {
          operatingInflows += amount;
        }
        categoryBreakdown.operating.push({
          category: txn.category,
          amount: type === 'expense' ? -amount : amount,
          date: txn.date
        });
      }
    });
    
    // Calculate net cash flows
    const operatingCashFlow = operatingInflows - operatingOutflows;
    const investingCashFlow = investingInflows - investingOutflows;
    const financingCashFlow = financingInflows - financingOutflows;
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    
    // Prepare response data
    const cashFlowData = {
      // Operating Activities
      operatingInflows,
      operatingOutflows,
      operatingCashFlow,
      
      // Investing Activities
      investingInflows,
      investingOutflows,
      investingCashFlow,
      
      // Financing Activities
      financingInflows,
      financingOutflows,
      financingCashFlow,
      
      // Net Cash Flow
      netCashFlow,
      
      // Period info
      startDate: start,
      endDate: end,
      transactionCount: transactions.length,
      
      // Breakdown by category
      breakdown: categoryBreakdown
    };
    
    console.log('✅ Cash flow calculated:', {
      operating: operatingCashFlow,
      investing: investingCashFlow,
      financing: financingCashFlow,
      net: netCashFlow
    });
    
    res.json({
      success: true,
      data: cashFlowData
    });
    
  } catch (error) {
    console.error('❌ Cash Flow Data error:', error);
    res.status(500).json({ 
      error: 'Failed to generate cash flow data',
      message: error.message 
    });
  }
});

module.exports = router;
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
router.get('/balance-sheet/test', (req, res) => {
  console.log('📊 Balance Sheet test request received');
  res.json({ message: 'Balance Sheet endpoint works!', timestamp: new Date().toISOString() });
});

// Balance Sheet PDF Generation
router.get('/balance-sheet/pdf', async (req, res) => {
  console.log('📊 Balance Sheet PDF request received');
  try {
    const { generateBalanceSheetPDF } = require('../utils/balanceSheetPdfGenerator');
    
    // Sample Balance Sheet data
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
router.get('/balance-sheet/excel', async (req, res) => {
  console.log('📊 Balance Sheet Excel request received');
  try {
    const { generateBalanceSheetExcel } = require('../utils/balanceSheetExcelGenerator');
    
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
router.get('/cash-flow/test', (req, res) => {
  console.log('💰 Cash Flow test request received');
  res.json({ message: 'Cash Flow endpoint works!', timestamp: new Date().toISOString() });
});

// Cash Flow PDF Generation
router.get('/cash-flow/pdf', async (req, res) => {
  console.log('💰 Cash Flow PDF request received');
  try {
    const { generateCashFlowPDF } = require('../utils/cashFlowPdfGenerator');
    
    // Sample Cash Flow data
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
router.get('/cash-flow/excel', async (req, res) => {
  console.log('💰 Cash Flow Excel request received');
  try {
    const { generateCashFlowExcel } = require('../utils/cashFlowExcelGenerator');
    
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

module.exports = router;
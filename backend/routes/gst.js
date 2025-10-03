const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');

// Import models
const { GSTInvoice, GSTReturn } = require('../models');
const GenInvoice = require('../models/GenInvoice'); // Use existing invoice model

// Simple auth middleware
const auth = (req, res, next) => {
  req.user = { business: 'business-1' };
  next();
};

// GET /api/gst/summary - Get GST summary for dashboard
router.get('/summary', auth, async (req, res) => {
  try {
    const { period } = req.query;
    const currentPeriod = period || dayjs().format('YYYY-MM');
    
    console.log(`Getting GST summary for period: ${currentPeriod}`);

    // Get invoices from your existing GenInvoice model for the period
    const [year, month] = currentPeriod.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    console.log(`Fetching GenInvoices for period ${currentPeriod}: ${startDate} to ${endDate}`);
    
    const invoices = await GenInvoice.find({
      business: req.user.business,
      status: { $in: ['FINAL', 'SENT', 'PAID'] },
      invoiceDate: { $gte: startDate, $lte: endDate }
    });

    console.log(`Found ${invoices.length} GenInvoices for summary`);

    // Calculate totals from existing invoice structure
    let currentMonthGST = 0;
    let totalTaxableValue = 0;
    
    invoices.forEach(invoice => {
      console.log(`Processing invoice ${invoice.invoiceNumber} with ${invoice.items?.length || 0} items`);
      
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach(item => {
          const itemTotal = item.quantity * item.rate;
          const gstRate = item.gstRate || 18; // Default 18%
          const gstAmount = itemTotal * gstRate / 100;
          
          currentMonthGST += gstAmount;
          totalTaxableValue += itemTotal;
          
          console.log(`Item: ${item.description}, Total: ${itemTotal}, GST Rate: ${gstRate}%, GST: ${gstAmount}`);
        });
      }
    });
    
    console.log(`Total calculated GST: ₹${currentMonthGST}, Taxable: ₹${totalTaxableValue}`);

    // Get returns for the period to check filing status
    const returns = await GSTReturn.find({
      business: req.user.business,
      period: currentPeriod
    });

    // Input tax credit (assuming 0 for now)
    const inputTaxCredit = 0;
    const netGSTPayable = Math.max(0, currentMonthGST - inputTaxCredit);

    // Calculate returns filed this financial year
    const currentYear = dayjs().year();
    const financialYearStart = currentYear >= 4 ? `${currentYear}-04` : `${currentYear - 1}-04`;
    
    const allReturnsThisYear = await GSTReturn.find({
      business: req.user.business,
      period: { $gte: financialYearStart }
    });

    const returnsFiled = allReturnsThisYear.filter(r => r.status === 'FILED').length;
    const totalReturns = 12; // Assuming monthly returns

    // Generate upcoming deadlines
    const upcomingDeadlines = [];
    
    // Current month deadlines  
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    
    const gstr1Due = nextMonth.date(11);
    const gstr3bDue = nextMonth.date(20);
    
    const gstr1Return = returns.find(r => r.returnType === 'GSTR-1');
    const gstr3bReturn = returns.find(r => r.returnType === 'GSTR-3B');

    upcomingDeadlines.push({
      return: "GSTR-1",
      period: currentPeriod,
      dueDate: gstr1Due.format('DD MMM YYYY'),
      status: gstr1Return ? gstr1Return.status.toLowerCase() : "pending",
      amount: `₹${currentMonthGST.toFixed(2)}`
    });

    upcomingDeadlines.push({
      return: "GSTR-3B", 
      period: currentPeriod,
      dueDate: gstr3bDue.format('DD MMM YYYY'),
      status: gstr3bReturn ? gstr3bReturn.status.toLowerCase() : "pending",
      amount: `₹${currentMonthGST.toFixed(2)}`
    });

    const summary = {
      currentMonth: currentPeriod,
      currentMonthGST: Math.round(currentMonthGST * 100) / 100,
      inputTaxCredit: Math.round(inputTaxCredit * 100) / 100,
      netGSTPayable: Math.round(netGSTPayable * 100) / 100,
      totalInvoices: invoices.length,
      totalTaxableValue: Math.round(totalTaxableValue * 100) / 100,
      returnsFiled,
      totalReturns,
      upcomingDeadlines
    };

    console.log('GST Summary calculated:', summary);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('GST summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get GST summary',
      error: error.message
    });
  }
});

// GET /api/gst/periods - Get available periods with data from GenInvoice
router.get('/periods', auth, async (req, res) => {
  try {
    // Get all invoices and calculate periods from invoiceDate
    const invoices = await GenInvoice.find({
      business: req.user.business,
      status: { $in: ['FINAL', 'SENT', 'PAID'] }
    }).select('invoiceDate');

    const periods = new Set();
    invoices.forEach(invoice => {
      const date = new Date(invoice.invoiceDate);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      periods.add(period);
    });

    const periodsWithData = await Promise.all([...periods].map(async (period) => {
      const [year, month] = period.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      
      const invoiceCount = await GenInvoice.countDocuments({
        business: req.user.business,
        status: { $in: ['FINAL', 'SENT', 'PAID'] },
        invoiceDate: { $gte: startDate, $lte: endDate }
      });

      const returnStatus = await GSTReturn.find({
        business: req.user.business,
        period
      }).select('returnType status');

      return {
        period,
        invoiceCount,
        returns: returnStatus
      };
    }));

    res.json({
      success: true,
      data: periodsWithData.sort((a, b) => b.period.localeCompare(a.period))
    });

  } catch (error) {
    console.error('Get periods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get periods',
      error: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const TDS = require('../models/TDS');
const { TDSCalculator } = require('../utils/tdsCalculation');

console.log('TDS Route loaded, TDS model:', TDS ? 'OK' : 'FAILED');

// 1. TDS Calculation Route
router.post('/calculate', async (req, res) => {
  try {
    const { amount, section } = req.body;

    if (!amount || !section) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount and TDS section are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than 0'
      });
    }

    const tdsCalculation = TDSCalculator.calculateTDS({
      amount,
      section
    });

    res.json({
      success: true,
      data: tdsCalculation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating TDS'
    });
  }
});

// 2. Record TDS Deduction (POST to save data)
router.post('/record-deduction', async (req, res) => {
  try {
    const { payeeName, payeePAN, paymentAmount, tdsSection, paymentDate, notes } = req.body;

    console.log('Received TDS record request:', req.body);

    if (!payeeName || !paymentAmount || !tdsSection) {
      return res.status(400).json({
        success: false,
        message: 'Payee name, payment amount, and TDS section are required'
      });
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be a valid positive number'
      });
    }

    let tdsCalculation;
    try {
      tdsCalculation = TDSCalculator.calculateTDS({
        amount: amount,
        section: tdsSection
      });
    } catch (calcError) {
      console.error('TDS Calculation Error:', calcError);
      return res.status(400).json({
        success: false,
        message: 'Error in TDS calculation: ' + calcError.message
      });
    }

    // Get the applicable threshold for this TDS section
    const thresholdAmount = TDSCalculator.getThresholdAmount(tdsSection, 'Individual');

    // Mock user and business IDs (replace with actual auth middleware values)
    const userId = req.user?.id || '650f3f0c8f8c9a12a7654321';
    const businessId = req.user?.biz || '650f3f0c8f8c9a12a1234567';

    const tdsEntry = new TDS({
      user: userId,
      business: businessId,
      payeeName: payeeName.trim(),
      payeePAN: payeePAN ? payeePAN.trim().toUpperCase() : undefined,
      tdsSection,
      paymentAmount: amount,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      applicableThreshold: thresholdAmount,
      tdsRate: tdsCalculation.applicable ? tdsCalculation.tdsRate : 0,
      tdsAmount: tdsCalculation.applicable ? (tdsCalculation.basicTDS || tdsCalculation.totalTDS) : 0,
      netPayment: tdsCalculation.netPayment,
      status: 'pending',
      notes: notes || '',
      createdBy: userId
    });

    await tdsEntry.save();

    res.status(201).json({
      success: true,
      message: 'TDS deduction recorded successfully',
      data: {
        id: tdsEntry._id,
        payeeName: tdsEntry.payeeName,
        paymentAmount: tdsEntry.paymentAmount,
        tdsAmount: tdsEntry.tdsAmount,
        netPayment: tdsEntry.netPayment,
        tdsSection: tdsEntry.tdsSection,
        applicableThreshold: tdsEntry.applicableThreshold,
        tdsRate: tdsEntry.tdsRate,
        recordDate: tdsEntry.recordDate
      }
    });

  } catch (error) {
    console.error('Error recording TDS deduction:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error recording TDS deduction'
    });
  }
});

// 3. TDS Sections (for dropdown options)
router.get('/sections', async (req, res) => {
  try {
    const sections = TDSCalculator.getAllSections();
    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching TDS sections'
    });
  }
});

// 4. Dashboard Data (GET to fetch data for display)
router.get('/dashboard', async (req, res) => {
  try {
    console.log('=== TDS Dashboard Route Called ===');
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    console.log('Date range:', { startOfYear, endOfYear });

    // Get overall statistics
    console.log('Starting aggregation query...');
    const totalDeducted = await TDS.aggregate([
      {
        $match: {
          recordDate: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $group: {
          _id: null,
          totalTDSAmount: { $sum: '$tdsAmount' },
          totalPaymentAmount: { $sum: '$paymentAmount' },
          totalEntries: { $sum: 1 }
        }
      }
    ]);
    console.log('Aggregation result:', totalDeducted);

    // Get recent deductions (last 10)
    console.log('Fetching recent deductions...');
    const recentDeductions = await TDS.find({})
      .sort({ recordDate: -1, createdAt: -1 })
      .limit(10)
      .select('payeeName paymentAmount tdsAmount tdsSection recordDate tdsRate applicableThreshold netPayment');
    console.log('Recent deductions count:', recentDeductions.length);
    console.log('Recent deductions:', recentDeductions);

    const stats = {
      totalDeducted: totalDeducted[0]?.totalTDSAmount || 0,
      totalPayment: totalDeducted[0]?.totalPaymentAmount || 0,
      totalEntries: totalDeducted[0]?.totalEntries || 0,
      statusCounts: { recorded: totalDeducted[0]?.totalEntries || 0 },
      recentDeductions: recentDeductions || []
    };
    console.log('Final stats:', stats);

    console.log('Sending response...');
    res.json({
      success: true,
      data: stats,
      message: stats.totalEntries === 0 ? 'No TDS records found' : null
    });

  } catch (error) {
    console.error('=== Dashboard route error ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Unable to load dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 4. TDS Returns Routes
router.get('/returns', async (req, res) => {
  try {
    console.log('Fetching TDS returns...');
    
    // Get TDS data aggregated by quarter for returns
    const tdsRecords = await TDS.find({}).sort({ recordDate: -1 });
    
    // Group by financial year and quarter
    const returnsSummary = {};
    
    tdsRecords.forEach(record => {
      const recordDate = new Date(record.recordDate);
      const month = recordDate.getMonth() + 1; // 1-12
      const year = recordDate.getFullYear();
      
      // Determine financial year and quarter
      let financialYear, quarter;
      if (month >= 4) {
        financialYear = `${year}-${year + 1}`;
        if (month >= 4 && month <= 6) quarter = 'Q1';
        else if (month >= 7 && month <= 9) quarter = 'Q2';
        else if (month >= 10 && month <= 12) quarter = 'Q3';
      } else {
        financialYear = `${year - 1}-${year}`;
        if (month >= 1 && month <= 3) quarter = 'Q4';
      }
      
      const key = `${financialYear}-${quarter}`;
      
      if (!returnsSummary[key]) {
        returnsSummary[key] = {
          financialYear,
          quarter,
          totalAmount: 0,
          deductees: new Set(),
          records: []
        };
      }
      
      returnsSummary[key].totalAmount += record.tdsAmount;
      returnsSummary[key].deductees.add(record.payeeName);
      returnsSummary[key].records.push(record);
    });
    
    // Convert to returns format
    const returns = Object.entries(returnsSummary).map(([key, data], index) => {
      const quarterEndDates = {
        'Q1': '07-31', // Q1: Apr-Jun, due July 31
        'Q2': '10-31', // Q2: Jul-Sep, due Oct 31
        'Q3': '01-31', // Q3: Oct-Dec, due Jan 31
        'Q4': '05-31'  // Q4: Jan-Mar, due May 31
      };
      
      const [fyStart] = data.financialYear.split('-');
      const fyEnd = parseInt(fyStart) + 1;
      const dueDateMonth = quarterEndDates[data.quarter];
      const dueYear = data.quarter === 'Q4' ? fyEnd : (data.quarter === 'Q3' ? fyEnd : parseInt(fyStart));
      
      return [
        {
          id: `${key}-24Q`,
          type: 'Form 24Q',
          quarter: `${data.quarter} ${data.financialYear}`,
          dueDate: `${dueYear}-${dueDateMonth.split('-')[0]}-${dueDateMonth.split('-')[1]}`,
          status: 'pending',
          amount: Math.round(data.totalAmount),
          deductees: data.deductees.size,
          records: data.records.length
        },
        {
          id: `${key}-26Q`,
          type: 'Form 26Q',
          quarter: `${data.quarter} ${data.financialYear}`,
          dueDate: `${dueYear}-${dueDateMonth.split('-')[0]}-${dueDateMonth.split('-')[1]}`,
          status: 'pending',
          amount: Math.round(data.totalAmount * 0.3), // Assume 30% for 26Q
          deductees: Math.ceil(data.deductees.size * 0.3),
          records: Math.ceil(data.records.length * 0.3)
        }
      ];
    }).flat();
    
    console.log(`Generated ${returns.length} TDS returns from ${tdsRecords.length} records`);
    
    res.json({
      success: true,
      data: returns.slice(0, 8) // Limit to recent 8 returns
    });
    
  } catch (error) {
    console.error('TDS Returns fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch TDS returns',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
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
    const { payeeName, paymentAmount, tdsSection } = req.body;

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

    const tdsEntry = new TDS({
      payeeName: payeeName.trim(),
      tdsSection,
      paymentAmount: amount,
      applicableThreshold: thresholdAmount,
      tdsRate: tdsCalculation.applicable ? tdsCalculation.tdsRate : 0,
      tdsAmount: tdsCalculation.applicable ? (tdsCalculation.basicTDS || tdsCalculation.totalTDS) : 0,
      netPayment: tdsCalculation.netPayment
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

module.exports = router;
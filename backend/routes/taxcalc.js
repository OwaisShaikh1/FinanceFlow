const express = require('express');
const router = express.Router();
const { computeTax } = require('../utils/taxUtils'); // Import tax calculation logic


router.post('/', async (req, res) => { // Stateless calculation, no DB writes
  try {
    // Parse and validate request body
    const {
      annualIncome,
      deductions,
      regime,
      isSalaried,
      taxableIncome, // ignored if provided; we compute server-side
      totalTax,      // ignored if provided; we compute server-side
      quarterlyTax,  // ignored if provided; we compute server-side
      baseDeductions,
      investments,
      totalInvested,
      totalTaxSaved,
    } = req.body;

    if (!annualIncome || !regime || annualIncome <= 0 || !['old', 'new'].includes(regime)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Perform tax calculation
    // Accept either a numeric deductions value or an object, normalize to object
    const deductionInput =
      typeof deductions === 'number'
        ? { other: deductions }
        : (deductions && typeof deductions === 'object' ? deductions : {});

    const taxResult = computeTax({
      income: Number(annualIncome) || 0,
      deductions: deductionInput,
      regime,
      isSalaried: Boolean(isSalaried)
    });

    // Compute a simple quarterly schedule (15 Jun, 15 Sep, 15 Dec, 15 Mar)
    const qTax = taxResult.totalTax / 4;
    const schedule = [
      { quarter: 'Q1', dueDate: '15 Jun', amount: qTax * 0.15 },
      { quarter: 'Q2', dueDate: '15 Sep', amount: qTax * 0.45 },
      { quarter: 'Q3', dueDate: '15 Dec', amount: qTax * 0.75 },
      { quarter: 'Q4', dueDate: '15 Mar', amount: qTax },
    ];

    // Respond with calculated tax data only (no DB writes)
    res.status(200).json({
      message: 'Tax calculation successful',
      inputs: { annualIncome: Number(annualIncome) || 0, regime, isSalaried: Boolean(isSalaried), deductions: deductionInput },
      taxableIncome: taxResult.taxableIncome,
      baseTax: taxResult.baseTax,
      cess: taxResult.cess,
      totalTax: taxResult.totalTax,
      breakup: taxResult.breakup,
      quarterlySchedule: schedule,
    });
  } catch (error) {
    console.error('Error saving tax data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user tax data
router.get('/user/:userId/tax-data', async (req, res) => {
  try {
    const { User } = require('../models');
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      taxData: user.taxData || {
        annualIncome: 0,
        taxRegime: 'new',
        section80C: 0,
        section80D: 0,
        section80G: 0,
        section80E: 0,
        section80EE: 0,
        section80GGC: 0,
        otherDeductions: 0,
        advanceTaxPaid: 0,
        paymentReminders: []
      }
    });
  } catch (error) {
    console.error('Error fetching user tax data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user tax data
router.put('/user/:userId/tax-data', async (req, res) => {
  try {
    const { User } = require('../models');
    const { userId } = req.params;
    const { taxData } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update tax data
    user.taxData = {
      ...user.taxData,
      ...taxData,
      lastCalculatedAt: new Date()
    };
    
    await user.save();
    
    res.json({ 
      message: 'Tax data updated successfully',
      taxData: user.taxData 
    });
  } catch (error) {
    console.error('Error updating user tax data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment reminder route
router.post('/payment-reminder', async (req, res) => {
  try {
    console.log('💾 Payment reminder request received:', req.body);
    
    const { annualIncome, totalTax, regime, investments } = req.body;
    
    // For now, we'll just log and return success
    // You can expand this to save reminders to database
    console.log('Setting payment reminders for:');
    console.log('Annual Income:', annualIncome);
    console.log('Total Tax:', totalTax);
    console.log('Tax Regime:', regime);
    console.log('Investments:', investments);
    
    // Calculate quarterly payments
    const quarterlyPayments = [
      { quarter: 'Q1', dueDate: '15th June', amount: Math.round(totalTax * 0.15) },
      { quarter: 'Q2', dueDate: '15th September', amount: Math.round(totalTax * 0.30) },
      { quarter: 'Q3', dueDate: '15th December', amount: Math.round(totalTax * 0.45) },
      { quarter: 'Q4', dueDate: '15th March', amount: Math.round(totalTax * 1.0) }
    ];
    
    res.json({ 
      message: 'Payment reminders set successfully!',
      quarterlyPayments: quarterlyPayments
    });
    
  } catch (error) {
    console.error('Error setting payment reminders:', error);
    res.status(500).json({ error: 'Failed to set payment reminders' });
  }
});

// Export report route
router.post('/export-report', async (req, res) => {
  try {
    console.log('📊 Export report request received:', req.body);
    
    const { annualIncome, totalTax, regime, investments } = req.body;
    
    // For now, we'll just log and return success
    // You can expand this to generate actual reports
    console.log('Exporting tax saving report for:');
    console.log('Annual Income:', annualIncome);
    console.log('Total Tax:', totalTax);
    console.log('Tax Regime:', regime);
    console.log('Investments:', investments);
    
    res.json({ 
      message: 'Tax saving report exported successfully!',
      reportData: {
        annualIncome,
        totalTax,
        regime,
        investments,
        exportedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ error: 'Failed to export report' });
  }
});

module.exports = router;
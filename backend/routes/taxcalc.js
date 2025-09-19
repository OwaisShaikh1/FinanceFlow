const express = require('express');
const router = express.Router();
const TaxCalculation = require('../models/TaxCalculation'); // Import the TaxCalculation model
const { computeTax } = require('../utils/taxUtils'); // Import tax calculation logic


router.post('/', async (req, res) => { // Updated route to '/'
  try {
    // Parse and validate request body
    const {
      annualIncome,
      deductions,
      regime,
      taxableIncome,
      totalTax,
      quarterlyTax,
      baseDeductions,
      investments,
      totalInvested,
      totalTaxSaved,
    } = req.body;

    if (!annualIncome || !regime || annualIncome <= 0 || !['old', 'new'].includes(regime)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Perform tax calculation
    const taxResult = computeTax({
      income: annualIncome,
      deductions: deductions || 0,
      regime
    });

    // Prepare data for insertion
    const taxData = new TaxCalculation({
      annualIncome,
      deductions,
      regime,
      taxableIncome: taxResult.taxableIncome,
      totalTax: taxResult.totalTax,
      quarterlyTax: [
        { quarter: 'Q1', dueDate: '2025-06-15', amount: taxResult.totalTax / 4 },
        { quarter: 'Q2', dueDate: '2025-09-15', amount: taxResult.totalTax / 4 },
        { quarter: 'Q3', dueDate: '2025-12-15', amount: taxResult.totalTax / 4 },
        { quarter: 'Q4', dueDate: '2026-03-15', amount: taxResult.totalTax / 4 }
      ],
      baseDeductions: taxResult.baseDeductions || 0,
      investments: taxResult.investments || {},
      totalInvested: taxResult.totalInvested || 0,
      totalTaxSaved: taxResult.totalTaxSaved || 0,
      createdAt: new Date(),
    });

    // Save data to MongoDB
    const result = await taxData.save();

    // Respond with calculated tax data
    res.status(200).json({
      message: 'Tax calculation successful',
      id: result._id,
      taxableIncome: taxResult.taxableIncome,
      totalTax: taxResult.totalTax,
      breakup: taxResult.breakup
    });
  } catch (error) {
    console.error('Error saving tax data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
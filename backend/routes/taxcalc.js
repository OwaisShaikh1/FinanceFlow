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

module.exports = router;
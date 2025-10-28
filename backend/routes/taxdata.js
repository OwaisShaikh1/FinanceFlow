const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

// User Tax Data Routes (for Combined Tax Calculator)
router.get('/:userId/tax-data', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📊 Fetching tax data for user:', userId, 'requested by:', req.user.id, 'role:', req.user.role);
    
    // Security check: Users can only access their own data unless they are admin/CA
    if (req.user.role !== 'Admin' && req.user.role !== 'admin' && 
        req.user.role !== 'CA' && req.user.role !== 'ca' && 
        userId !== req.user.id) {
      return res.status(403).json({ 
        message: 'Access denied. You can only access your own tax data.' 
      });
    }
    
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

router.put('/:userId/tax-data', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const taxData = req.body;
    
    console.log('💾 Updating tax data for user:', userId, 'requested by:', req.user.id, 'role:', req.user.role);
    
    // Security check: Users can only update their own data unless they are admin/CA
    if (req.user.role !== 'Admin' && req.user.role !== 'admin' && 
        req.user.role !== 'CA' && req.user.role !== 'ca' && 
        userId !== req.user.id) {
      return res.status(403).json({ 
        message: 'Access denied. You can only update your own tax data.' 
      });
    }
    
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

module.exports = router;
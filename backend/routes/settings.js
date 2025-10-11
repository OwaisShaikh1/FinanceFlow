const express = require('express');
const User = require('../models/User');
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

// Get user settings
router.get('/:userId/settings', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract settings from user document
    const settings = {
      // Profile Settings
      fullName: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      
      // Business Settings
      businessName: user.businessName || '',
      businessType: user.businessType || '',
      gstin: user.gstin || '',
      pan: user.pan || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      
      // Tax Settings
      taxRegime: user.taxData?.taxRegime || 'new',
      defaultTaxRate: user.defaultTaxRate || 18,
      
      // Notification Settings
      emailNotifications: user.preferences?.emailNotifications !== false,
      smsNotifications: user.preferences?.smsNotifications || false,
      reminderNotifications: user.preferences?.reminderNotifications !== false,
      
      // System Settings
      theme: user.preferences?.theme || 'light',
      language: user.preferences?.language || 'en',
      currency: user.preferences?.currency || 'INR',
      dateFormat: user.preferences?.dateFormat || 'DD/MM/YYYY',
      
      // Security Settings
      twoFactorAuth: user.security?.twoFactorAuth || false,
      sessionTimeout: user.security?.sessionTimeout || 30
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update user settings
router.put('/:userId/settings', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = settings.fullName || user.name;
    user.email = settings.email || user.email;
    user.phone = settings.phone || user.phone;
    user.avatar = settings.avatar || user.avatar;
    
    // Business information
    user.businessName = settings.businessName || user.businessName;
    user.businessType = settings.businessType || user.businessType;
    user.gstin = settings.gstin || user.gstin;
    user.pan = settings.pan || user.pan;
    user.address = settings.address || user.address;
    user.city = settings.city || user.city;
    user.state = settings.state || user.state;
    user.pincode = settings.pincode || user.pincode;
    
    // Tax settings
    if (!user.taxData) user.taxData = {};
    user.taxData.taxRegime = settings.taxRegime || user.taxData.taxRegime;
    user.defaultTaxRate = settings.defaultTaxRate || user.defaultTaxRate;
    
    // Preferences
    if (!user.preferences) user.preferences = {};
    user.preferences.emailNotifications = settings.emailNotifications;
    user.preferences.smsNotifications = settings.smsNotifications;
    user.preferences.reminderNotifications = settings.reminderNotifications;
    user.preferences.theme = settings.theme || user.preferences.theme;
    user.preferences.language = settings.language || user.preferences.language;
    user.preferences.currency = settings.currency || user.preferences.currency;
    user.preferences.dateFormat = settings.dateFormat || user.preferences.dateFormat;
    
    // Security settings
    if (!user.security) user.security = {};
    user.security.twoFactorAuth = settings.twoFactorAuth || user.security.twoFactorAuth;
    user.security.sessionTimeout = settings.sessionTimeout || user.security.sessionTimeout;

    // Update last modified
    user.updatedAt = new Date();

    await user.save();

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

// Complete user profile after Google login
router.post('/complete-profile', async (req, res) => {
  try {
    const { username, phone, role, company } = req.body;
    
    // Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const userId = decoded.id;
    
    // Validate input
    if (!username || !phone || !role || !company) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, phone, role, and company are required' 
      });
    }

    // Update user with additional information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username,
        phone: phone,
        role: role,
        company: company,
        businessName: company, // Also set as business name
        profileCompleted: true,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    console.log(`Profile completed for user: ${updatedUser.email}`);

    res.json({
      success: true,
      message: 'Profile completed successfully',
      user: updatedUser.toObject()
    });

  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during profile completion',
      details: error.message 
    });
  }
});

module.exports = router;
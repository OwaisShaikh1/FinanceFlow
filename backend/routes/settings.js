const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Simulated auth middleware
const auth = (req, res, next) => {
  req.user = { biz: 'business-1' };
  next();
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

module.exports = router;
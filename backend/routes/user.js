const express = require('express');
const User = require('../models/User');
const { auth, sendSuccess, sendError } = require('../utils/middleware');

const router = express.Router();

// ===================== PROFILE MANAGEMENT =====================
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return sendError(res, 404, 'User not found');
    
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password updates through this route
    delete updates.role; // Prevent role escalation
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    sendSuccess(res, user, 'Profile updated');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// ===================== ONBOARDING =====================
router.post('/complete-profile', auth, async (req, res) => {
  try {
    const { username, phone, role, company } = req.body;

    if (!username || !phone || !role || !company) {
      return sendError(res, 400, 'All fields are required');
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        phone,
        role,
        company,
        businessName: company,
        profileCompleted: true,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    sendSuccess(res, user, 'Profile completed successfully');
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// ===================== CLIENT MANAGEMENT =====================
router.get('/clients/stats', auth, async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: 'user' });
    const activeClients = await User.countDocuments({ 
      role: 'user', 
      accountStatus: 'active',
      lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    const stats = {
      totalClients,
      activeClients,
      activePercentage: totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0,
      inactiveClients: totalClients - activeClients
    };

    sendSuccess(res, stats);
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

router.get('/clients', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filter.accountStatus = status;

    const clients = await User.find(filter)
      .select('-password -firebaseUid -resetToken')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    // Transform data for frontend
    const transformedClients = clients.map(client => ({
      id: client._id,
      name: client.displayName || client.name,
      type: client.businessType || 'Individual',
      gstin: client.gstin || 'Not Available',
      email: client.email,
      phone: client.phone || 'Not Available',
      status: client.accountStatus || 'active',
      compliance: determineCompliance(client),
      lastActivity: formatLastActivity(client.lastLoginAt || client.createdAt),
      nextDeadline: 'GST Return - Mar 20', // Mock data
      revenue: formatRevenue(client.taxData?.annualIncome || 0)
    }));

    sendSuccess(res, {
      clients: transformedClients,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

router.get('/clients/:clientId', auth, async (req, res) => {
  try {
    const client = await User.findOne({ 
      _id: req.params.clientId, 
      role: 'user' 
    }).select('-password -resetToken');

    if (!client) return sendError(res, 404, 'Client not found');

    // Transform detailed client data
    const clientDetails = {
      id: client._id,
      name: client.displayName || client.name,
      email: client.email,
      phone: client.phone || 'Not Available',
      businessName: client.businessName || client.company || 'Not Available',
      businessType: client.businessType || 'Not Available',
      company: client.company || 'Not Available',
      gstin: client.gstin || 'Not Available',
      pan: client.pan || 'Not Available',
      filingScheme: client.filingScheme || 'monthly',
      address: client.address || 'Not Available',
      city: client.city || 'Not Available',
      state: client.state || 'Not Available',
      pincode: client.pincode || 'Not Available',
      taxData: client.taxData || {},
      role: client.role,
      provider: client.provider || 'email',
      createdAt: client.createdAt,
      status: client.accountStatus || 'active',
      compliance: determineCompliance(client),
      lastActivity: formatLastActivity(client.lastLoginAt || client.createdAt),
      nextDeadline: 'GST Return - Mar 20',
      revenue: formatRevenue(client.taxData?.annualIncome || 0)
    };

    sendSuccess(res, clientDetails);
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// ===================== HELPER FUNCTIONS =====================
function determineCompliance(user) {
  if (user.gstin && user.pan) return 'up-to-date';
  if (user.gstin || user.pan) return 'pending';
  return 'overdue';
}

function formatLastActivity(date) {
  const now = new Date();
  const diff = Math.abs(now - new Date(date));
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

function formatRevenue(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

module.exports = router;
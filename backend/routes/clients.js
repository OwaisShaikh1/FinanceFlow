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

// Helper functions for client data transformation
function determineComplianceStatus(user) {
  if (user.gstin && user.pan) {
    return 'up-to-date';
  } else if (user.gstin || user.pan) {
    return 'pending';
  } else {
    return 'overdue';
  }
}

function calculateLastActivity(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function getNextDeadline(user) {
  if (user.filingScheme === 'monthly') {
    return 'GST Return - Next Month';
  } else if (user.filingScheme === 'qrmp') {
    return 'GST Return - Next Quarter';
  } else {
    return 'ITR Filing - Mar 31';
  }
}

function calculateRevenue(taxData) {
  if (taxData && taxData.annualIncome) {
    return `₹${taxData.annualIncome.toLocaleString()}`;
  }
  return '₹0';
}

// Clients Stats API
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('📊 Fetching client statistics for user:', req.user.id, 'role:', req.user.role);
    
    // Role-based access control
    let query = {};
    
    if (req.user.role === 'Admin' || req.user.role === 'admin') {
      // Admin can see all users
      query = { role: 'user' };
    } else if (req.user.role === 'CA' || req.user.role === 'ca') {
      // CA can see their assigned clients (if you have this relationship)
      query = { role: 'user' }; // For now, same as admin - you might want to add assignedCA field
    } else {
      // Regular users can only see their own data
      query = { _id: req.user.id };
    }
    
    const totalClients = await User.countDocuments(query);
    const activeClientsQuery = {
      ...query,
      $or: [
        { gstin: { $exists: true, $ne: null, $ne: '' } },
        { pan: { $exists: true, $ne: null, $ne: '' } }
      ]
    };
    const activeClients = await User.countDocuments(activeClientsQuery);
    
    // Calculate pending tasks (users with role "user" without GST/PAN)
    const pendingTasks = totalClients - activeClients;
    
    // Calculate overdue items (created more than 30 days ago without GST/PAN)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const overdueQuery = {
      ...query,
      createdAt: { $lt: thirtyDaysAgo },
      $and: [
        { $or: [{ gstin: { $exists: false } }, { gstin: null }, { gstin: '' }] },
        { $or: [{ pan: { $exists: false } }, { pan: null }, { pan: '' }] }
      ]
    };
    const overdueItems = await User.countDocuments(overdueQuery);

    const stats = {
      totalClients,
      activeClients,
      pendingTasks,
      overdueItems,
      activePercentage: totalClients > 0 ? ((activeClients / totalClients) * 100).toFixed(1) : '0'
    };

    res.json({ 
      success: true, 
      stats 
    });
  } catch (error) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching client stats', 
      error: error.message 
    });
  }
});

// Clients Management API
router.get('/', auth, async (req, res) => {
  try {
    console.log('📊 Fetching clients for user:', req.user.id, 'role:', req.user.role);
    
    // Role-based access control
    let query = {};
    
    if (req.user.role === 'Admin' || req.user.role === 'admin') {
      // Admin can see all users
      query = { role: 'user' };
    } else if (req.user.role === 'CA' || req.user.role === 'ca') {
      // CA can see their assigned clients
      query = { role: 'user' }; // For now - you might want to add assignedCA field later
    } else {
      // Regular users can only see their own data
      query = { _id: req.user.id };
    }
    
    // Fetch users based on permissions
    const clients = await User.find(query, {
      name: 1,
      email: 1,
      phone: 1,
      company: 1,
      businessName: 1,
      businessType: 1,
      gstin: 1,
      role: 1,
      createdAt: 1,
      pan: 1,
      city: 1,
      state: 1,
      filingScheme: 1,
      taxData: 1
    }).sort({ createdAt: -1 });

    // Transform the data to match the frontend structure
    const transformedClients = clients.map(user => ({
      id: user._id,
      name: user.businessName || user.company || user.name,
      type: user.businessType || (user.role === 'ca' ? 'CA' : 'Individual'),
      gstin: user.gstin || 'Not Available',
      email: user.email,
      phone: user.phone || 'Not Available',
      status: 'active',
      compliance: determineComplianceStatus(user),
      lastActivity: calculateLastActivity(user.createdAt),
      nextDeadline: getNextDeadline(user),
      revenue: calculateRevenue(user.taxData),
      pan: user.pan || 'Not Available',
      city: user.city || 'Not Available',
      state: user.state || 'Not Available',
      filingScheme: user.filingScheme || 'monthly'
    }));

    res.json({ 
      success: true, 
      clients: transformedClients,
      total: transformedClients.length 
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching clients', 
      error: error.message 
    });
  }
});

// Get specific client details
router.get('/:clientId', auth, async (req, res) => {
  try {
    const { clientId } = req.params;
    console.log('📊 Fetching client details for:', clientId, 'by user:', req.user.id, 'role:', req.user.role);
    
    // Role-based access control
    let query = { _id: clientId };
    
    if (req.user.role === 'Admin' || req.user.role === 'admin') {
      // Admin can see any user
      query = { _id: clientId };
    } else if (req.user.role === 'CA' || req.user.role === 'ca') {
      // CA can see their assigned clients
      query = { _id: clientId, role: 'user' };
    } else {
      // Regular users can only see their own data
      if (clientId !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You can only view your own data.' 
        });
      }
      query = { _id: req.user.id };
    }
    
    // Find user by ID with permission check
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
    }

    // Transform user data to detailed client information
    const clientDetails = {
      id: user._id,
      // Basic Information
      name: user.name,
      email: user.email,
      phone: user.phone || 'Not Available',
      
      // Business Information
      businessName: user.businessName || 'Not Available',
      businessType: user.businessType || 'Individual',
      company: user.company || 'Not Available',
      
      // Tax Information
      gstin: user.gstin || 'Not Available',
      pan: user.pan || 'Not Available',
      filingScheme: user.filingScheme || 'monthly',
      
      // Address Information
      address: user.address || 'Not Available',
      city: user.city || 'Not Available',
      state: user.state || 'Not Available',
      pincode: user.pincode || 'Not Available',
      
      // Tax Data
      taxData: user.taxData || {
        annualIncome: 0,
        taxRegime: 'new',
        section80C: 0,
        section80D: 0,
        totalTaxSaved: 0,
        estimatedAnnualTax: 0
      },
      
      // Account Information
      role: user.role,
      provider: user.provider || 'email',
      createdAt: user.createdAt,
      
      // Calculated Fields
      status: 'active',
      compliance: determineComplianceStatus(user),
      lastActivity: calculateLastActivity(user.createdAt),
      nextDeadline: getNextDeadline(user),
      revenue: calculateRevenue(user.taxData)
    };

    res.json({ 
      success: true, 
      client: clientDetails
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching client details', 
      error: error.message 
    });
  }
});

module.exports = router;
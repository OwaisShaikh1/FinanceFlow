   const express = require('express');
const jwt = require('jsonwebtoken');

// Import the correct model
const GenInvoice = require('../models/GenInvoice');
const RecurringTemplate = require('../models/RecuringTemplate');
const { generateTaxProInvoicePDF } = require('../utils/invoicePdfGenerator');

const router = express.Router();

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = { 
      id: decoded.userId || decoded.id, 
      biz: decoded.businessId || 'business-1' 
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create invoice
router.post('/', auth, async (req, res) => {
  try {
    if (!req.body) throw new Error('No data received');

    let items = req.body.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { items = []; }
    }

    // Calculate GST based on tax type
    const taxType = req.body.taxType || 'CGST+SGST';
    let subtotal = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items = items.map(item => {
      const amount = item.quantity * item.rate;
      const gstAmount = (amount * item.gstRate) / 100;
      
      let cgstAmount = 0;
      let sgstAmount = 0;
      let igstAmount = 0;

      if (taxType === 'CGST+SGST') {
        cgstAmount = gstAmount / 2;
        sgstAmount = gstAmount / 2;
      } else {
        igstAmount = gstAmount;
      }

      subtotal += amount;
      totalCGST += cgstAmount;
      totalSGST += sgstAmount;
      totalIGST += igstAmount;

      return {
        ...item,
        amount,
        cgstAmount,
        sgstAmount,
        igstAmount,
        gstAmount,
        total: amount + gstAmount
      };
    });

    const invoiceData = {
      user: req.user.id,
      business: req.user.biz,
      invoiceNumber: req.body.invoiceNumber,
      clientName: req.body.clientName,
      clientGstin: req.body.clientGstin,
      clientAddress: req.body.clientAddress,
      clientCity: req.body.clientCity,
      clientState: req.body.clientState,
      clientPincode: req.body.clientPincode,
      taxType,
      items,
      subtotal,
      totalCGST,
      totalSGST,
      totalIGST,
      totalGst: totalCGST + totalSGST + totalIGST,
      grandTotal: subtotal + totalCGST + totalSGST + totalIGST,
      status: req.body.status || 'DRAFT',
      invoiceDate: req.body.invoiceDate,
      dueDate: req.body.dueDate,
      paymentTerms: req.body.paymentTerms,
      notes: req.body.notes,
      bankDetails: req.body.bankDetails,
      pdfUrl: req.body.pdfUrl,
      ewayBillNo: req.body.ewayBillNo,
    };

    console.log('Invoice data to save:', invoiceData);

    const invoice = await GenInvoice.create(invoiceData);
    return res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (e) {
    console.error('Error creating invoice:', e);
    return res.status(400).json({ message: e.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    // Filter invoices by authenticated user
    const invoices = await GenInvoice.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log('Found invoices for user:', req.user.id, '- Count:', invoices.length);
    
    const tableData = invoices.map(inv => {
      return {
        _id: inv._id,
        invoiceNumber: inv.invoiceNumber,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        clientName: inv.clientName,
        taxType: inv.taxType,
        subtotal: inv.subtotal || 0,
        totalCGST: inv.totalCGST || 0,
        totalSGST: inv.totalSGST || 0,
        totalIGST: inv.totalIGST || 0,
        totalGst: inv.totalGst || 0,
        grandTotal: inv.grandTotal || 0,
        status: inv.status
      };
    });
    return res.json(tableData);
  } catch (e) {
    console.error('Error fetching invoices:', e);
    return res.status(500).json({ message: e.message });
  }
});

// Update invoice status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating invoice ${id} status to ${status}`);
    
    // Validate status transitions
    const validStatuses = ['DRAFT', 'FINAL', 'SENT', 'PAID'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Get current invoice to validate transition and ownership
    const currentInvoice = await GenInvoice.findOne({ _id: id, user: req.user.id });
    if (!currentInvoice) {
      return res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }
    
    // Status transition validation
    const transitions = {
      'DRAFT': ['FINAL'],
      'FINAL': ['SENT', 'PAID'],
      'SENT': ['PAID'],
      'PAID': [] // Terminal state
    };
    
    if (!transitions[currentInvoice.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${currentInvoice.status} to ${status}` 
      });
    }
    
    // Update with additional fields based on status
    const updateData = { status };
    if (status === 'SENT') {
      updateData.sentDate = new Date();
    } else if (status === 'PAID') {
      updateData.paidDate = new Date();
    }
    
    const invoice = await GenInvoice.findByIdAndUpdate(
      id, 
      updateData,
      { new: true }
    );
    
    console.log(`Invoice ${id} updated to ${status}`);
    res.json({ message: 'Status updated successfully', invoice });
  } catch (e) {
    console.error('Status update error:', e);
    return res.status(500).json({ message: e.message });
  }
});

// Update invoice
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if invoice exists and user owns it
    const existingInvoice = await GenInvoice.findOne({ _id: id, user: req.user.id });
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }

    // Prepare update data
    const updateData = {
      invoiceNumber: req.body.invoiceNumber,
      clientName: req.body.clientName,
      clientGstin: req.body.clientGstin,
      items: req.body.items,
      status: req.body.status,
      invoiceDate: req.body.invoiceDate,
      dueDate: req.body.dueDate,
      business: req.body.business,
      pdfUrl: req.body.pdfUrl,
      ewayBillNo: req.body.ewayBillNo,
    };

    console.log('Updating invoice:', id, updateData);

    const updatedInvoice = await GenInvoice.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Invoice update error:', error);
    return res.status(400).json({ 
      message: 'Error updating invoice', 
      error: error.message 
    });
  }
});

// Generate and download PDF
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch invoice data and verify ownership
    const invoice = await GenInvoice.findOne({ _id: id, user: req.user.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }

    console.log('Generating PDF for invoice:', invoice.invoiceNumber);

    // Generate PDF
    const pdfBuffer = await generateTaxProInvoicePDF(invoice);
    
    // Set headers for PDF download
    const filename = `TaxPro_Invoice_${invoice.invoiceNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF buffer
    res.send(pdfBuffer);
    
    console.log(`PDF generated and sent for invoice ${invoice.invoiceNumber}`);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return res.status(500).json({ 
      message: 'Error generating PDF', 
      error: error.message 
    });
  }
});

// Get invoice statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const Business = require('../models/Business');
    
    // Priority: clientId param > authenticated user
    let userId = req.user.id;
    let businessId = null;
    
    // If clientId provided, use it (for CA viewing client data)
    if (req.query.clientId) {
      const user = await User.findById(req.query.clientId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      userId = user._id;
      const business = await Business.findOne({ owner: user._id });
      if (business) {
        businessId = business._id;
      }
      console.log(`Finding invoices for client ${req.query.clientId}, user: ${userId}`);
    }
    
    // Filter invoices by user ID (primary) or business ID (fallback)
    const invoices = await GenInvoice.find({ user: userId });
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Calculate current month invoices
    const currentMonthInvoices = invoices.filter(inv => {
      const invoiceDate = new Date(inv.invoiceDate);
      return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
    });
    
    // Calculate last month invoices for growth
    const lastMonthInvoices = invoices.filter(inv => {
      const invoiceDate = new Date(inv.invoiceDate);
      return invoiceDate.getMonth() === lastMonth && invoiceDate.getFullYear() === lastMonthYear;
    });
    
    // Count by status
    const paidInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'pending');
    const overdueInvoices = invoices.filter(inv => {
      const dueDate = new Date(inv.dueDate);
      const now = new Date();
      return inv.status?.toLowerCase() !== 'paid' && dueDate < now;
    });
    
    // Calculate amounts
    const pendingAmount = pendingInvoices.reduce((sum, inv) => {
      return sum + (inv.items?.reduce((itemSum, item) => itemSum + (item.amount || 0), 0) || 0);
    }, 0);
    
    const overdueAmount = overdueInvoices.reduce((sum, inv) => {
      return sum + (inv.items?.reduce((itemSum, item) => itemSum + (item.amount || 0), 0) || 0);
    }, 0);
    
    // Calculate payment rate
    const paymentRate = invoices.length > 0 ? (paidInvoices.length / invoices.length) * 100 : 0;
    
    // Calculate monthly growth
    const monthlyGrowth = currentMonthInvoices.length - lastMonthInvoices.length;
    
    const stats = {
      total: invoices.length,
      paid: paidInvoices.length,
      pending: pendingInvoices.length,
      overdue: overdueInvoices.length,
      pendingAmount: Math.round(pendingAmount),
      overdueAmount: Math.round(overdueAmount),
      paymentRate: Math.round(paymentRate),
      monthlyGrowth
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// ==================== RECURRING INVOICE ROUTES ====================

// GET all recurring invoice templates
router.get('/recurring', auth, async (req, res) => {
  try {
    const { business } = req.query;
    const query = business ? { business } : { business: req.user.biz };
    
    console.log('Fetching recurring templates with query:', query);
    
    const templates = await RecurringTemplate.find(query)
      .populate('business', 'name')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${templates.length} recurring templates`);
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching recurring templates:', error);
    res.status(500).json({ message: 'Error fetching recurring invoices', error: error.message });
  }
});

// POST create new recurring invoice template
router.post('/recurring', auth, async (req, res) => {
  try {
    const templateData = {
      business: req.body.business || req.user.biz,
      template: req.body.template,
      everyDays: req.body.everyDays,
      nextRun: req.body.nextRun || new Date()
    };
    
    console.log('Creating recurring template:', templateData);
    
    const recurringTemplate = await RecurringTemplate.create(templateData);
    
    console.log('Recurring template created:', recurringTemplate._id);
    
    res.status(201).json(recurringTemplate);
  } catch (error) {
    console.error('Error creating recurring template:', error);
    res.status(400).json({ message: 'Error creating recurring invoice', error: error.message });
  }
});

// PUT update recurring invoice template
router.put('/recurring/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Updating recurring template ${id}`);
    
    const updateData = {
      template: req.body.template,
      everyDays: req.body.everyDays,
      nextRun: req.body.nextRun
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const updatedTemplate = await RecurringTemplate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Recurring template not found' });
    }
    
    console.log('Recurring template updated:', updatedTemplate._id);
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating recurring template:', error);
    res.status(400).json({ message: 'Error updating recurring invoice', error: error.message });
  }
});

// DELETE recurring invoice template
router.delete('/recurring/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting recurring template ${id}`);
    
    const deletedTemplate = await RecurringTemplate.findByIdAndDelete(id);
    
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Recurring template not found' });
    }
    
    console.log('Recurring template deleted:', id);
    
    res.json({ message: 'Recurring template deleted successfully', id });
  } catch (error) {
    console.error('Error deleting recurring template:', error);
    res.status(500).json({ message: 'Error deleting recurring invoice', error: error.message });
  }
});

module.exports = router;

const express = require('express');

// Import the correct model
const Invoice = require('../models/Invoice');
const GenInvoice = require('../models/GenInvoice');
const RecurringTemplate = require('../models/RecuringTemplate');
const { generateTaxProInvoicePDF } = require('../utils/invoicePdfGenerator');
const { auth } = require('../utils/middleware');

const router = express.Router();

// Create invoice
router.post('/', auth, async (req, res) => {
  try {
    if (!req.body) throw new Error('No data received');

    let items = req.body.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { items = []; }
    }

    const invoiceData = {
      business: req.user.biz,
      invoiceNumber: req.body.invoiceNumber,
      clientName: req.body.clientName,
      clientGstin: req.body.clientGstin,
      items,
      status: req.body.status || 'DRAFT',
      invoiceDate: req.body.invoiceDate,
      dueDate: req.body.dueDate,
      pdfUrl: req.body.pdfUrl,
      ewayBillNo: req.body.ewayBillNo,
    };

    console.log('Invoice data to save:', invoiceData);

    const invoice = await GenInvoice.create(invoiceData);
    return res.status(201).json(invoice);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    // Build query based on client filtering
    const query = {};
    
    // Filter by client if clientId is provided
    if (req.query.clientId) {
      query.user = req.query.clientId;
    }
    
    // Filter by business if needed (for CA users viewing specific business)
    if (req.query.business) {
      query.business = req.query.business;
    }
    
    console.log('Invoice query:', query);
    
    const invoices = await Invoice.find(query)
      .populate('user', 'name email')
      .populate('business', 'name')
      .sort({ issueDate: -1 });
    
    console.log('Found invoices:', invoices.length);
    
    const tableData = invoices.map(inv => {
      return {
        _id: inv._id,
        number: inv.number,
        invoiceNumber: inv.number, // For backward compatibility
        issueDate: inv.issueDate,
        invoiceDate: inv.issueDate, // For backward compatibility
        dueDate: inv.dueDate,
        customerName: inv.customerName,
        clientName: inv.customerName, // For backward compatibility
        items: inv.items,
        subtotal: inv.subtotal,
        totalTax: inv.totalTax,
        totalGst: inv.totalTax, // For backward compatibility
        totalAmount: inv.totalAmount,
        grandTotal: inv.totalAmount, // For backward compatibility
        paidAmount: inv.paidAmount,
        balanceAmount: inv.balanceAmount,
        status: inv.status,
        user: inv.user,
        business: inv.business
      };
    });
    return res.json(tableData);
  } catch (e) {
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
    
    // Get current invoice to validate transition
    const currentInvoice = await GenInvoice.findById(id);
    if (!currentInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
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
    
    // Check if invoice exists
    const existingInvoice = await GenInvoice.findById(id);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user has access to this invoice
    if (existingInvoice.business !== req.user.biz) {
      return res.status(403).json({ message: 'Access denied' });
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
    
    // Fetch invoice data
    const invoice = await GenInvoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user has access to this invoice
    if (invoice.business !== req.user.biz) {
      return res.status(403).json({ message: 'Access denied' });
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
    
    // Build query based on client filtering
    const query = {};
    
    // If clientId provided, filter by user
    if (req.query.clientId) {
      query.user = req.query.clientId;
      console.log(`Finding invoices for client ${req.query.clientId}`);
    }
    
    // If business provided, filter by business
    if (req.query.business) {
      query.business = req.query.business;
    }
    
    console.log('Invoice stats query:', query);
    
    const invoices = await Invoice.find(query);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Calculate current month invoices (use issueDate for Invoice model)
    const currentMonthInvoices = invoices.filter(inv => {
      const invoiceDate = new Date(inv.issueDate);
      return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
    });
    
    // Calculate last month invoices for growth
    const lastMonthInvoices = invoices.filter(inv => {
      const invoiceDate = new Date(inv.issueDate);
      return invoiceDate.getMonth() === lastMonth && invoiceDate.getFullYear() === lastMonthYear;
    });
    
    // Count by status (Invoice model uses uppercase statuses)
    const paidInvoices = invoices.filter(inv => inv.status?.toUpperCase() === 'PAID');
    const pendingInvoices = invoices.filter(inv => ['SENT', 'PARTIAL'].includes(inv.status?.toUpperCase()));
    const overdueInvoices = invoices.filter(inv => {
      const dueDate = new Date(inv.dueDate);
      const now = new Date();
      return inv.status?.toUpperCase() === 'OVERDUE' || (inv.status?.toUpperCase() !== 'PAID' && dueDate < now);
    });
    
    // Calculate amounts (Invoice model has totalAmount field)
    const pendingAmount = pendingInvoices.reduce((sum, inv) => {
      return sum + (inv.balanceAmount || inv.totalAmount || 0);
    }, 0);
    
    const overdueAmount = overdueInvoices.reduce((sum, inv) => {
      return sum + (inv.balanceAmount || inv.totalAmount || 0);
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
    const query = {};
    
    // Support client filtering (consistent with regular invoices)
    if (req.query.clientId) {
      query.user = req.query.clientId;
      console.log(`Finding recurring invoices for client ${req.query.clientId}`);
    }
    
    // Support business filtering
    if (req.query.business) {
      query.business = req.query.business;
    }
    
    // Default to user's business if no filters provided
    if (!req.query.clientId && !req.query.business && req.user.biz) {
      query.business = req.user.biz;
    }
    
    console.log('Fetching recurring templates with query:', query);
    
    const templates = await RecurringTemplate.find(query)
      .populate('business', 'name')
      .populate('user', 'name email')
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

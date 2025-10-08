   const express = require('express');

// Import the correct model
const GenInvoice = require('../models/GenInvoice'); 
const { generateTaxProInvoicePDF } = require('../utils/invoicePdfGenerator');

const router = express.Router();
// Simulated auth middleware
const auth = (req, res, next) => {
  req.user = { biz: 'business-1' };
  next();
};

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
    const invoices = await GenInvoice.find({ business: req.user.biz });
    console.log('Found invoices:', invoices.length);
    
    const tableData = invoices.map(inv => {
      console.log('Processing invoice:', inv.invoiceNumber, 'Items:', inv.items.length);
      
      // Calculate totals from items array
      const subtotal = inv.items.reduce((sum, item) => {
        console.log('Item amount:', item.amount);
        return sum + (item.amount || 0);
      }, 0);
      
      const totalGst = inv.items.reduce((sum, item) => {
        console.log('Item GST:', item.gstAmount);
        return sum + (item.gstAmount || 0);
      }, 0);
      
      const grandTotal = inv.items.reduce((sum, item) => {
        console.log('Item total:', item.total);
        return sum + (item.total || 0);
      }, 0);
      
      console.log('Calculated:', { subtotal, totalGst, grandTotal });
      
      return {
        _id: inv._id,
        invoiceNumber: inv.invoiceNumber,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        clientName: inv.clientName,
        subtotal: subtotal,
        totalGst: totalGst,
        grandTotal: grandTotal,
        status: inv.status
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

module.exports = router;

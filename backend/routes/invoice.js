const express = require('express');


// Import the correct model
const GenInvoice = require('../models/GenInvoice'); 


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
    const tableData = invoices.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      clientName: inv.clientName,
      subtotal: inv.subtotal,
      totalGst: inv.totalGst,
      grandTotal: inv.grandTotal,
      status: inv.status
    }));
    return res.json(tableData);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;

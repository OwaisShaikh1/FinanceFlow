const express = require('express');
const router = express.Router();

// In-memory storage for invoices
let invoices = [];

// Simulated auth middleware (replace with real auth in production)
const auth = (req, res, next) => {
  req.user = { biz: 'business-1' };
  next();
};

// Create invoice
router.post('/', auth, (req, res) => {
  try {
    if (!req.body) throw new Error('No data received');
    console.log('Received invoice body:', req.body);
    // Parse items if sent as JSON string
    let items = req.body.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { items = []; }
    }
    const invoice = {
      id: String(invoices.length + 1),
      business: req.user.biz,
      invoiceNumber: req.body.invoiceNumber,
      poNumber: req.body.poNumber,
      invoiceDate: req.body.invoiceDate,
      dueDate: req.body.dueDate,
      paymentTerms: req.body.paymentTerms,
      clientName: req.body.clientName,
      clientGstin: req.body.clientGstin,
      clientAddress: req.body.clientAddress,
      clientCity: req.body.clientCity,
      clientState: req.body.clientState,
      clientPincode: req.body.clientPincode,
      items,
      notes: req.body.notes,
      bankDetails: req.body.bankDetails,
      createdAt: new Date(),
    };
    invoices.push(invoice);
    return res.status(201).json(invoice);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// Get all invoices
router.get('/', auth, (req, res) => {
  const list = invoices.filter(inv => inv.business === req.user.biz);
  return res.json(list);
});

module.exports = router;

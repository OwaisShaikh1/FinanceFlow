const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
const fs = require('fs');
const router = express.Router();

// Import models
const { GSTInvoice } = require('../models');
const GenInvoice = require('../models/GenInvoice'); // Use existing invoice model

// Configure multer for local file storage first, then database
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Simple auth middleware
const auth = (req, res, next) => {
  req.user = { business: 'business-1' };
  next();
};

// POST /api/invoices/upload - Upload invoice data
router.post('/upload', auth, async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerGSTIN,
      items,
      transactionType = 'B2B'
    } = req.body;

    // Calculate period from invoice date
    const date = new Date(invoiceDate);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Calculate totals from items
    let totalTaxableValue = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;
    let totalTax = 0;

    const processedItems = items.map(item => {
      const taxableValue = item.quantity * item.rate;
      const cgst = item.cgst || 0;
      const sgst = item.sgst || 0;
      const igst = item.igst || 0;
      const itemTotalTax = cgst + sgst + igst;
      const totalValue = taxableValue + itemTotalTax;

      totalTaxableValue += taxableValue;
      totalCGST += cgst;
      totalSGST += sgst;
      totalIGST += igst;
      totalTax += itemTotalTax;

      return {
        ...item,
        taxableValue,
        cgst,
        sgst,
        igst,
        totalTax: itemTotalTax,
        totalValue
      };
    });

    const invoiceValue = totalTaxableValue + totalTax;

    const invoice = new GSTInvoice({
      business: req.user.business,
      invoiceNumber,
      invoiceDate: new Date(invoiceDate),
      period,
      customerName,
      customerGSTIN: customerGSTIN || '',
      items: processedItems,
      totalTaxableValue,
      totalCGST,
      totalSGST,
      totalIGST,
      totalTax,
      invoiceValue,
      transactionType,
      status: 'FINAL'
    });

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice uploaded successfully',
      data: invoice
    });

  } catch (error) {
    console.error('Invoice upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload invoice',
      error: error.message
    });
  }
});

// GET /api/invoices - Get invoices with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { period, status, page = 1, limit = 10 } = req.query;
    
    const filter = { business: req.user.business };
    
    if (period) filter.period = period;
    if (status) filter.status = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { invoiceDate: -1 }
    };

    const invoices = await GSTInvoice.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await GSTInvoice.countDocuments(filter);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
});

// GET /api/invoices/:id - Get single invoice
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await GSTInvoice.findOne({
      _id: req.params.id,
      business: req.user.business
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
});

// PATCH /api/invoices/:id - Update invoice
router.patch('/:id', auth, async (req, res) => {
  try {
    const invoice = await GSTInvoice.findOneAndUpdate(
      { _id: req.params.id, business: req.user.business },
      { $set: req.body },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });

  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice',
      error: error.message
    });
  }
});

// POST /api/invoices/bulk-upload - Upload CSV/Excel files
router.post('/bulk-upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Processing bulk upload:', req.file.originalname);
    
    let invoiceData = [];
    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    // Parse file based on extension
    if (fileExt === 'csv') {
      // Parse CSV
      const results = [];
      
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });
      
      invoiceData = results;
    } 
    else if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Parse Excel using ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      
      invoiceData = [];
      const headers = [];
      
      // Get headers from first row
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value;
      });
      
      // Process data rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            if (headers[colNumber]) {
              rowData[headers[colNumber]] = cell.value;
            }
          });
          invoiceData.push(rowData);
        }
      });
    }
    else {
      throw new Error('Unsupported file format');
    }

    console.log(`Parsed ${invoiceData.length} rows from file`);

    // Group items by invoice number
    const invoiceGroups = {};
    invoiceData.forEach(row => {
      const invoiceNumber = row.invoiceNumber || row.InvoiceNumber;
      if (!invoiceGroups[invoiceNumber]) {
        invoiceGroups[invoiceNumber] = {
          invoiceNumber,
          invoiceDate: row.invoiceDate || row.InvoiceDate,
          customerName: row.customerName || row.CustomerName,
          customerGSTIN: row.customerGSTIN || row.CustomerGSTIN || '',
          items: []
        };
      }
      
      // Add item
      invoiceGroups[invoiceNumber].items.push({
        description: row.itemDescription || row.ItemDescription || 'Item',
        quantity: Number(row.quantity || row.Quantity || 1),
        rate: Number(row.rate || row.Rate || 0),
        cgst: Number(row.cgst || row.CGST || 0),
        sgst: Number(row.sgst || row.SGST || 0), 
        igst: Number(row.igst || row.IGST || 0)
      });
    });

    // Create invoices using existing GenInvoice model
    const createdInvoices = [];
    for (const [invoiceNumber, invoiceInfo] of Object.entries(invoiceGroups)) {
      try {
        // Process items for GenInvoice format
        const processedItems = invoiceInfo.items.map((item, index) => ({
          id: `item-${index + 1}`,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          gstRate: ((item.cgst + item.sgst + item.igst) / (item.quantity * item.rate)) * 100 || 18, // Calculate GST rate
          amount: item.quantity * item.rate,
          gstAmount: item.cgst + item.sgst + item.igst,
          total: (item.quantity * item.rate) + (item.cgst + item.sgst + item.igst)
        }));

        // Create invoice using existing GenInvoice model structure
        const invoice = await GenInvoice.create({
          business: req.user.business,
          invoiceNumber: invoiceInfo.invoiceNumber,
          clientName: invoiceInfo.customerName,
          clientGstin: invoiceInfo.customerGSTIN || '',
          items: processedItems,
          status: 'FINAL',
          invoiceDate: new Date(invoiceInfo.invoiceDate),
          dueDate: new Date(new Date(invoiceInfo.invoiceDate).getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days later
          pdfUrl: '',
          ewayBillNo: ''
        });

        createdInvoices.push(invoice);
        console.log(`Created invoice ${invoiceNumber} with ${processedItems.length} items`);
        
      } catch (error) {
        console.error(`Error creating invoice ${invoiceNumber}:`, error);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: `Successfully processed ${createdInvoices.length} invoices`,
      data: {
        processedCount: createdInvoices.length,
        totalRows: invoiceData.length,
        invoices: createdInvoices.map(inv => ({
          id: inv._id,
          invoiceNumber: inv.invoiceNumber,
          clientName: inv.clientName,
          itemCount: inv.items.length,
          totalGST: inv.items.reduce((sum, item) => sum + (item.gstAmount || 0), 0)
        }))
      }
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process bulk upload',
      error: error.message
    });
  }
});

module.exports = router;
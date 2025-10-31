const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');

// Import models  
const { GSTInvoice, GSTReturn } = require('../models');
const GenInvoice = require('../models/GenInvoice'); // Use existing invoice model
const { auth } = require('../utils/middleware');

// GET /api/returns - Get all returns
router.get('/', auth, async (req, res) => {
  try {
    const { period, status } = req.query;
    const filter = { business: req.user.business };
    
    if (period) filter.period = period;
    if (status) filter.status = status;

    const returns = await GSTReturn.find(filter)
      .sort({ period: -1, returnType: 1 })
      .populate('invoiceIds', 'invoiceNumber invoiceValue');

    res.json({
      success: true,
      data: returns
    });

  } catch (error) {
    console.error('Get returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch returns',
      error: error.message
    });
  }
});

// POST /api/returns/prepare - Prepare return draft from invoices
router.post('/prepare', auth, async (req, res) => {
  try {
    const { period, returnType } = req.body; // period: "2025-10", returnType: "GSTR-1" or "GSTR-3B"

    console.log(`Preparing ${returnType} for period ${period}`);

    // Get all FINAL invoices from existing GenInvoice model for the period
    const [year, month] = period.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    console.log(`Fetching GenInvoices for return preparation ${period}: ${startDate} to ${endDate}`);
    
    const invoices = await GenInvoice.find({
      business: req.user.business,
      status: { $in: ['FINAL', 'SENT', 'PAID'] },
      invoiceDate: { $gte: startDate, $lte: endDate }
    });

    console.log(`Found ${invoices.length} GenInvoices for period ${period}`);

    if (invoices.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No FINAL invoices found for period ${period}`
      });
    }

    // Calculate aggregated GST data from existing invoice structure
    let outputGST = 0;
    let inputTaxCredit = 0; // Assuming 0 for now (no purchase invoices)
    
    const b2bData = [];
    const b2cData = [];
    const exportData = [];

    invoices.forEach(invoice => {
      let invoiceGST = 0;
      let invoiceTaxable = 0;
      
      // Calculate GST from items
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach(item => {
          const itemTotal = item.quantity * item.rate;
          const gstRate = item.gstRate || 18;
          const gstAmount = itemTotal * gstRate / 100;
          
          invoiceGST += gstAmount;
          invoiceTaxable += itemTotal;
        });
      }
      
      outputGST += invoiceGST;

      // Categorize by transaction type using existing GenInvoice structure
      const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        invoiceValue: invoiceTaxable + invoiceGST,
        taxableValue: invoiceTaxable,
        cgst: invoiceGST / 2, // Assuming equal CGST/SGST split
        sgst: invoiceGST / 2,
        igst: 0, // Assuming intra-state
        totalTax: invoiceGST,
        customerName: invoice.clientName, // Note: using clientName from GenInvoice
        customerGSTIN: invoice.clientGstin || '' // Note: using clientGstin from GenInvoice
      };

      // Default to B2B for existing invoices
      const transactionType = invoice.clientGstin ? 'B2B' : 'B2C';
      
      if (transactionType === 'B2B') {
        b2bData.push(invoiceData);
      } else {
        b2cData.push(invoiceData);
      }
    });

    const netPayable = Math.max(0, outputGST - inputTaxCredit);

    // Set due date based on return type
    const dueDay = returnType === 'GSTR-1' ? 11 : 20;
    const dueDate = dayjs(`${year}-${month + 1}-${dueDay}`).toDate();

    // Check if return already exists
    let gstReturn = await GSTReturn.findOne({
      business: req.user.business,
      period,
      returnType
    });

    if (!gstReturn) {
      // Create new return
      gstReturn = new GSTReturn({
        business: req.user.business,
        returnType,
        period,
        dueDate,
        outputGST,
        inputTaxCredit,
        netPayable,
        returnData: {
          b2b: b2bData,
          b2c: b2cData,
          exports: exportData
        },
        invoiceIds: invoices.map(inv => inv._id),
        status: 'DRAFT'
      });
    } else {
      // Update existing draft
      gstReturn.outputGST = outputGST;
      gstReturn.inputTaxCredit = inputTaxCredit;
      gstReturn.netPayable = netPayable;
      gstReturn.returnData = {
        b2b: b2bData,
        b2c: b2cData,
        exports: exportData
      };
      gstReturn.invoiceIds = invoices.map(inv => inv._id);
    }

    await gstReturn.save();

    res.json({
      success: true,
      message: `${returnType} prepared successfully for ${period}`,
      data: {
        returnId: gstReturn._id,
        returnType: gstReturn.returnType,
        period: gstReturn.period,
        status: gstReturn.status,
        outputGST: gstReturn.outputGST,
        inputTaxCredit: gstReturn.inputTaxCredit,
        netPayable: gstReturn.netPayable,
        invoiceCount: invoices.length,
        summary: {
          b2b: b2bData.length,
          b2c: b2cData.length,
          exports: exportData.length
        }
      }
    });

  } catch (error) {
    console.error('Prepare return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to prepare return',
      error: error.message
    });
  }
});

// POST /api/returns/generate - Generate GST JSON file
router.post('/generate', auth, async (req, res) => {
  try {
    const { returnId } = req.body;

    const gstReturn = await GSTReturn.findOne({
      _id: returnId,
      business: req.user.business
    });

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        message: 'Return not found'
      });
    }

    if (gstReturn.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Only DRAFT returns can be generated'
      });
    }

    // Generate GST JSON (simplified structure)
    const gstJson = {
      gstin: "YOUR_GSTIN_HERE", // Should come from taxpayer data
      returnType: gstReturn.returnType,
      period: gstReturn.period,
      generatedDate: new Date().toISOString(),
      summary: {
        outputGST: gstReturn.outputGST,
        inputTaxCredit: gstReturn.inputTaxCredit,
        netPayable: gstReturn.netPayable
      },
      data: gstReturn.returnData
    };

    // In production, save JSON to S3/file system
    const fileName = `${gstReturn.returnType}_${gstReturn.period}_${Date.now()}.json`;
    const jsonFileUrl = `/temp/${fileName}`; // Mock URL

    // Update return status
    gstReturn.status = 'GENERATED';
    gstReturn.generatedDate = new Date();
    gstReturn.jsonFileUrl = jsonFileUrl;
    gstReturn.fileName = fileName;

    await gstReturn.save();

    res.json({
      success: true,
      message: 'GST JSON generated successfully',
      data: {
        returnId: gstReturn._id,
        fileName,
        fileUrl: jsonFileUrl,
        status: gstReturn.status,
        gstJson: gstJson
      }
    });

  } catch (error) {
    console.error('Generate return error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate return',
      error: error.message
    });
  }
});

// GET /api/returns/:id/json - Download GST JSON
router.get('/:id/json', auth, async (req, res) => {
  try {
    const gstReturn = await GSTReturn.findOne({
      _id: req.params.id,
      business: req.user.business
    });

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        message: 'Return not found'
      });
    }

    if (gstReturn.status === 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: 'Return not generated yet'
      });
    }

    // In production, stream file from S3/file system
    const mockJson = {
      gstin: "YOUR_GSTIN_HERE",
      returnType: gstReturn.returnType,
      period: gstReturn.period,
      data: gstReturn.returnData
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${gstReturn.fileName}"`);
    res.json(mockJson);

  } catch (error) {
    console.error('Download JSON error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download JSON',
      error: error.message
    });
  }
});

// PATCH /api/returns/:id/status - Update return status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const gstReturn = await GSTReturn.findOne({
      _id: req.params.id,
      business: req.user.business
    });

    if (!gstReturn) {
      return res.status(404).json({
        success: false,
        message: 'Return not found'
      });
    }

    // Update status with appropriate dates
    gstReturn.status = status;
    
    if (status === 'FILED') {
      gstReturn.filedDate = new Date();
    }

    await gstReturn.save();

    res.json({
      success: true,
      message: `Return status updated to ${status}`,
      data: {
        returnId: gstReturn._id,
        status: gstReturn.status,
        filedDate: gstReturn.filedDate
      }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Tax Reports API
const { generateGSTReportPDF } = require('../utils/gstReportPdfGenerator');
const { generateGSTReportExcel } = require('../utils/gstReportExcelGenerator');

// GST Report PDF endpoint
router.get('/gst/pdf', async (req, res) => {
  try {
    console.log('🏛️ GST Report PDF generation requested');
    
    const reportData = {
      businessName: 'Sample Business Pvt Ltd',
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 45600,
      gstPaid: 12800,
      tdsDeducted: 8500,
      pendingReturns: 2,
      gstSummary: [
        { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
        { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
        { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' },
        { period: 'September 2024', sales: 198000, gstCollected: 35640, gstPaid: 15800, netGST: 19840, status: 'Filed' },
        { period: 'August 2024', sales: 212000, gstCollected: 38160, gstPaid: 16200, netGST: 21960, status: 'Filed' }
      ],
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
      ]
    };
    
    console.log('📊 Generating GST Report PDF with data:', reportData);
    
    const buffer = await generateGSTReportPDF(reportData);
    
    console.log('✅ GST Report PDF generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="gst-tax-report-${Date.now()}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ GST Report PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate GST Report PDF',
      message: error.message 
    });
  }
});

// GST Report Excel endpoint  
router.get('/gst/excel', async (req, res) => {
  try {
    console.log('📋 GST Report Excel generation requested');
    
    const reportData = {
      businessName: 'Sample Business Pvt Ltd',
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 45600,
      gstPaid: 12800,
      tdsDeducted: 8500,
      pendingReturns: 2,
      gstSummary: [
        { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
        { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
        { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' },
        { period: 'September 2024', sales: 198000, gstCollected: 35640, gstPaid: 15800, netGST: 19840, status: 'Filed' },
        { period: 'August 2024', sales: 212000, gstCollected: 38160, gstPaid: 16200, netGST: 21960, status: 'Filed' }
      ],
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
      ]
    };
    
    console.log('💰 Generating GST Report Excel with data:', reportData);
    
    const buffer = await generateGSTReportExcel(reportData);
    
    console.log('✅ GST Report Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="gst-tax-report-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ GST Report Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate GST Report Excel',
      message: error.message 
    });
  }
});

// TDS Report PDF endpoint (using GST generator for now)
router.get('/tds/pdf', async (req, res) => {
  try {
    console.log('🏛️ TDS Report PDF generation requested');
    
    const reportData = {
      businessName: 'Sample Business PvLtd',
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 0, // TDS focused report
      gstPaid: 0,
      tdsDeducted: 57500, // Focus on TDS
      pendingReturns: 1,
      gstSummary: [], // Empty for TDS report
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' },
        { quarter: 'Q4 2023', totalPayments: 295000, tdsDeducted: 14750, tdsDeposited: 14750, dueDate: '2024-04-07', status: 'Filed' }
      ]
    };
    
    console.log('📊 Generating TDS Report PDF with data:', reportData);
    
    const buffer = await generateGSTReportPDF(reportData); // Reusing GST generator for TDS
    
    console.log('✅ TDS Report PDF generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="tds-tax-report-${Date.now()}.pdf"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ TDS Report PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate TDS Report PDF',
      message: error.message 
    });
  }
});

// TDS Report Excel endpoint (using GST generator for now)
router.get('/tds/excel', async (req, res) => {
  try {
    console.log('📋 TDS Report Excel generation requested');
    
    const reportData = {
      businessName: 'Sample Business PvLtd', 
      reportDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      gstCollected: 0, // TDS focused report
      gstPaid: 0,
      tdsDeducted: 57500, // Focus on TDS
      pendingReturns: 1,
      gstSummary: [], // Empty for TDS report
      tdsSummary: [
        { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
        { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
        { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' },
        { quarter: 'Q4 2023', totalPayments: 295000, tdsDeducted: 14750, tdsDeposited: 14750, dueDate: '2024-04-07', status: 'Filed' }
      ]
    };
    
    console.log('💰 Generating TDS Report Excel with data:', reportData);
    
    const buffer = await generateGSTReportExcel(reportData); // Reusing GST generator for TDS
    
    console.log('✅ TDS Report Excel generated successfully, size:', buffer.length, 'bytes');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="tds-tax-report-${Date.now()}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('❌ TDS Report Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate TDS Report Excel',
      message: error.message 
    });
  }
});

module.exports = router;
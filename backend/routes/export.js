const express = require('express');
const jwt = require('jsonwebtoken');
const pdfGenerator = require('../utils/pdfGenerator');
const excelGenerator = require('../utils/excelGenerator');
const router = express.Router();

// Export Actions Route
router.post('/', async (req, res) => {
  try {
    const { action, reportType, data } = req.body;
    console.log('Export API received:', { action, reportType, data });

    switch (action) {
      case 'print':
        // Generate print-ready HTML/CSS
        return res.json({
          success: true,
          action: 'print',
          message: 'Report formatted for printing',
          printUrl: `/api/export/print/${reportType}`,
        });

      case 'share':
        // Generate shareable link with expiration
        const shareToken = jwt.sign(
          { reportType, userId: req.user?.id || req.user?.userId, data },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        const shareUrl = `${req.protocol}://${req.get('host')}/shared/${shareToken}`;
        
        return res.json({
          success: true,
          action: 'share',
          message: 'Shareable link generated',
          shareUrl: shareUrl,
          expiresIn: '7 days'
        });

      case 'export-pdf':
      case 'pdf':
        // Generate PDF from the current webpage URL
        const { url } = req.body;
        
        if (!url) {
          return res.status(400).json({ error: 'URL is required for PDF generation' });
        }
        
        // Generate PDF from the actual webpage content with selective extraction
        const pdfBuffer = await pdfGenerator.capturePageAsPDF(url, {
          format: 'A4',
          printBackground: true,
          selectiveExtraction: true, // This tells the generator to use our selective logic
          reportType: reportType
        });
        
        const pdfFilename = `${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        return res.send(pdfBuffer);

      case 'excel':
        // Generate Excel from report data
        console.log('Generating Excel for reportType:', reportType);
        console.log('Report data:', data);
        
        try {
          // Generate Excel buffer using the report data
          const excelBuffer = await excelGenerator.generateFinancialReport(data || {}, reportType || 'financial-report');
          
          // Sanitize filename to prevent header issues
          const sanitizedReportType = (reportType || 'report').replace(/[^a-zA-Z0-9-_]/g, '-');
          const excelFilename = `${sanitizedReportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
          
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename="${excelFilename}"`);
          res.setHeader('Content-Length', excelBuffer.length);
          
          console.log('Excel file generated successfully, size:', excelBuffer.length);
          return res.send(excelBuffer);
          
        } catch (excelError) {
          console.error('Excel generation error:', excelError);
          return res.status(500).json({ error: 'Excel generation failed: ' + excelError.message });
        }

      default:
        return res.status(400).json({ error: 'Invalid action. Use: print, share, export-pdf, or excel' });
    }
  } catch (error) {
    console.error('Export error:', error);
    
    if (error.message.includes('net::ERR_FAILED')) {
      return res.status(400).json({ error: 'Unable to access the report page. Please ensure you are logged in.' });
    }
    
    res.status(500).json({ error: 'Export failed: ' + error.message });
  }
});

module.exports = router;
const puppeteer = require('puppeteer');

const generateTaxProInvoicePDF = async (invoiceData) => {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Calculate totals
    let subtotal = 0;
    let totalGst = 0;
    
    invoiceData.items.forEach(item => {
      subtotal += item.amount;
      totalGst += item.gstAmount;
    });
    
    const grandTotal = subtotal + totalGst;
    
    // Format date helper
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tax Pro Invoice - ${invoiceData.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: #fff;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        
        .company-info {
          flex: 1;
        }
        
        .company-name {
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        
        .company-tagline {
          font-size: 14px;
          color: #64748b;
          font-style: italic;
          margin-bottom: 15px;
        }
        
        .company-details {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }
        
        .invoice-title {
          text-align: right;
          flex: 1;
        }
        
        .invoice-title h1 {
          font-size: 36px;
          color: #2563eb;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .invoice-number {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 5px;
        }
        
        .invoice-date {
          font-size: 12px;
          color: #64748b;
        }
        
        .client-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        
        .bill-to, .invoice-details {
          flex: 1;
        }
        
        .bill-to h3, .invoice-details h3 {
          color: #2563eb;
          font-size: 14px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .client-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 5px;
        }
        
        .client-details {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }
        
        .invoice-details {
          text-align: right;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 12px;
        }
        
        .detail-label {
          color: #64748b;
        }
        
        .detail-value {
          color: #1e293b;
          font-weight: 600;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .items-table th {
          background: #2563eb;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .items-table th:first-child {
          border-radius: 6px 0 0 0;
        }
        
        .items-table th:last-child {
          border-radius: 0 6px 0 0;
          text-align: right;
        }
        
        .items-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px;
        }
        
        .items-table tbody tr:hover {
          background: #f8fafc;
        }
        
        .items-table tbody tr:last-child td {
          border-bottom: none;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .font-medium {
          font-weight: 600;
        }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }
        
        .totals-table {
          width: 300px;
          border-collapse: collapse;
        }
        
        .totals-table td {
          padding: 8px 12px;
          font-size: 13px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .totals-table .label {
          color: #64748b;
          text-align: left;
        }
        
        .totals-table .amount {
          text-align: right;
          font-weight: 600;
          color: #1e293b;
        }
        
        .grand-total {
          background: #2563eb;
          color: white !important;
          font-weight: bold;
          font-size: 16px;
        }
        
        .grand-total td {
          border: none;
          color: white;
        }
        
        .notes-section {
          margin-top: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        
        .notes-title {
          color: #2563eb;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .notes-content {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
        }
        
        .footer-highlight {
          color: #2563eb;
          font-weight: 600;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .invoice-container {
            box-shadow: none;
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <div class="company-name">TAX PRO</div>
            <div class="company-tagline">Professional Tax & Financial Services</div>
            <div class="company-details">
              📍 123 Business District, Financial Tower<br>
              📞 +91 98765 43210 | ✉️ info@taxpro.com<br>
              🌐 www.taxpro.com | GSTIN: 27ABCDE1234F1Z5
            </div>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <div class="invoice-number">Invoice No: ${invoiceData.invoiceNumber}</div>
            <div class="invoice-date">Date: ${formatDate(invoiceData.invoiceDate)}</div>
          </div>
        </div>
        
        <!-- Client Information -->
        <div class="client-info">
          <div class="bill-to">
            <h3>Bill To</h3>
            <div class="client-name">${invoiceData.clientName}</div>
            <div class="client-details">
              ${invoiceData.clientGstin ? `GSTIN: ${invoiceData.clientGstin}<br>` : ''}
              Client ID: ${invoiceData.business || 'N/A'}
            </div>
          </div>
          <div class="invoice-details">
            <h3>Invoice Details</h3>
            <div class="detail-row">
              <span class="detail-label">Invoice Date:</span>
              <span class="detail-value">${formatDate(invoiceData.invoiceDate)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Due Date:</span>
              <span class="detail-value">${formatDate(invoiceData.dueDate)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value">${invoiceData.status}</span>
            </div>
          </div>
        </div>
        
        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Rate (₹)</th>
              <th class="text-center">GST%</th>
              <th class="text-right">Amount (₹)</th>
              <th class="text-right">GST (₹)</th>
              <th class="text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr>
                <td class="font-medium">${item.description}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">₹${item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td class="text-center">${item.gstRate}%</td>
                <td class="text-right">₹${item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td class="text-right">₹${item.gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td class="text-right font-medium">₹${item.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div class="totals-section">
          <table class="totals-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td class="label">Total GST:</td>
              <td class="amount">₹${totalGst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr class="grand-total">
              <td class="label">Grand Total:</td>
              <td class="amount">₹${grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
          </table>
        </div>
        
        <!-- Notes -->
        <div class="notes-section">
          <div class="notes-title">Terms & Conditions</div>
          <div class="notes-content">
            • Payment is due within 30 days of the invoice date.<br>
            • Late payments may incur additional charges as per our terms.<br>
            • All services are provided by Tax Pro with professional standards.<br>
            • For any queries, please contact us at the above mentioned details.
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          Generated by <span class="footer-highlight">Tax Pro</span> • Professional Tax & Financial Services<br>
          This is a system-generated invoice • ${formatDate(new Date())}
        </div>
      </div>
    </body>
    </html>
    `;
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
        right: '0.5in'
      }
    });
    
    await browser.close();
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

module.exports = { generateTaxProInvoicePDF };
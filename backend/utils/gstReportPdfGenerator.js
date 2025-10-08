const puppeteer = require('puppeteer');

async function generateGSTReportPDF(reportData) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
  
  // Calculate totals for GST Summary
  const totalSales = reportData.gstSummary?.reduce((sum, item) => sum + (item.sales || 0), 0) || 0;
  const totalGSTCollected = reportData.gstSummary?.reduce((sum, item) => sum + (item.gstCollected || 0), 0) || 0;
  const totalGSTPaid = reportData.gstSummary?.reduce((sum, item) => sum + (item.gstPaid || 0), 0) || 0;
  const totalNetGST = reportData.gstSummary?.reduce((sum, item) => sum + (item.netGST || 0), 0) || 0;
  
  // Process chart data for visualization
  const processChartData = () => {
    const monthlyData = {};
    const statusData = {};
    
    // Process monthly GST data
    if (reportData.gstSummary) {
      reportData.gstSummary.forEach(item => {
        const month = item.period || 'Unknown Period';
        monthlyData[month] = {
          sales: item.sales || 0,
          gstCollected: item.gstCollected || 0,
          gstPaid: item.gstPaid || 0,
          netGST: item.netGST || 0
        };
        
        // Count by status
        const status = item.status || 'Unknown';
        statusData[status] = (statusData[status] || 0) + 1;
      });
    }
    
    return { monthlyData, statusData };
  };
  
  const chartData = processChartData();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Generate comprehensive HTML content
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GST Summary Report</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #fff;
      }
      
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 3px solid #2563eb;
        padding-bottom: 20px;
      }
      
      .taxpro-brand {
        font-size: 14px;
        color: #1e40af;
        font-weight: 600;
        margin-bottom: 10px;
      }
      
      .company-name {
        font-size: 28px;
        font-weight: bold;
        color: #1e40af;
        margin-bottom: 5px;
      }
      
      .report-title {
        font-size: 24px;
        color: #374151;
        margin-bottom: 5px;
      }
      
      .report-subtitle {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 10px;
      }
      
      .report-date {
        font-size: 16px;
        color: #4b5563;
        font-weight: 500;
      }
      
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .summary-card {
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #e2e8f0;
        text-align: center;
      }
      
      .card-title {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .card-amount {
        font-size: 24px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        color: #1e40af;
      }
      
      .card-subtitle {
        font-size: 12px;
        color: #6b7280;
        margin-top: 5px;
      }
      
      .gst-container {
        margin-bottom: 30px;
      }
      
      .section {
        margin-bottom: 30px;
        background: #f8fafc;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .section-title {
        background: linear-gradient(135deg, #3b82f6, #1e40af);
        color: white;
        padding: 15px 20px;
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      
      th {
        background: #f1f5f9;
        font-weight: 600;
        color: #475569;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.5px;
      }
      
      td {
        background: #fff;
      }
      
      .amount {
        text-align: right;
        font-weight: 500;
        font-family: 'Courier New', monospace;
      }
      
      .status {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .status.pending {
        background: #fef3c7;
        color: #92400e;
      }
      
      .status.filed {
        background: #d1fae5;
        color: #065f46;
      }
      
      .status.deposited {
        background: #dbeafe;
        color: #1e40af;
      }
      
      .total-row {
        background: #f1f5f9 !important;
        font-weight: bold;
        border-top: 2px solid #3b82f6;
      }
      
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
        text-align: center;
        color: #6b7280;
        font-size: 12px;
      }
      
      .footer p {
        margin: 5px 0;
      }
      
      @media print {
        .container {
          max-width: 100%;
          padding: 10px;
        }
        
        .section {
          page-break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="taxpro-brand">TaxPro</div>
        <div class="company-name">${reportData.businessName || 'Your Business'}</div>
        <div class="report-title">GST Summary Report</div>
        <div class="report-subtitle">GST collections, payments, and compliance overview</div>
        <div class="report-date">Generated on ${reportData.reportDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-title">GST Collected</div>
          <div class="card-amount">${formatCurrency(reportData.gstCollected || 45600)}</div>
          <div class="card-subtitle">This month</div>
        </div>
        <div class="summary-card">
          <div class="card-title">GST Paid</div>
          <div class="card-amount">${formatCurrency(reportData.gstPaid || 12800)}</div>
          <div class="card-subtitle">Input tax credit</div>
        </div>
        <div class="summary-card">
          <div class="card-title">TDS Deducted</div>
          <div class="card-amount">${formatCurrency(reportData.tdsDeducted || 8500)}</div>
          <div class="card-subtitle">This quarter</div>
        </div>
        <div class="summary-card">
          <div class="card-title">Pending Returns</div>
          <div class="card-amount">${reportData.pendingReturns || 2}</div>
          <div class="card-subtitle">Due this month</div>
        </div>
      </div>

      <!-- GST Summary Report -->
      <div class="gst-container">
        <div class="section">
          <div class="section-title">GST Summary Report - Monthly Collections and Payments</div>
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Sales</th>
                <th>GST Collected</th>
                <th>GST Paid</th>
                <th>Net GST</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(reportData.gstSummary || [
                { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
                { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
                { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' }
              ]).map(item => `
                <tr>
                  <td>${item.period || 'Unknown Period'}</td>
                  <td class="amount">${formatCurrency(item.sales || 0)}</td>
                  <td class="amount">${formatCurrency(item.gstCollected || 0)}</td>
                  <td class="amount">${formatCurrency(item.gstPaid || 0)}</td>
                  <td class="amount">${formatCurrency(item.netGST || 0)}</td>
                  <td><span class="status ${(item.status || '').toLowerCase()}">${item.status || 'Unknown'}</span></td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td class="amount"><strong>${formatCurrency(totalSales)}</strong></td>
                <td class="amount"><strong>${formatCurrency(totalGSTCollected)}</strong></td>
                <td class="amount"><strong>${formatCurrency(totalGSTPaid)}</strong></td>
                <td class="amount"><strong>${formatCurrency(totalNetGST)}</strong></td>
                <td><strong>-</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TDS Summary Report -->
        <div class="section">
          <div class="section-title">TDS Summary Report - Quarterly Deductions and Deposits</div>
          <table>
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Total Payments</th>
                <th>TDS Deducted</th>
                <th>TDS Deposited</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(reportData.tdsSummary || [
                { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
                { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
                { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
              ]).map(item => `
                <tr>
                  <td>${item.quarter || 'Unknown Quarter'}</td>
                  <td class="amount">${formatCurrency(item.totalPayments || 0)}</td>
                  <td class="amount">${formatCurrency(item.tdsDeducted || 0)}</td>
                  <td class="amount">${formatCurrency(item.tdsDeposited || 0)}</td>
                  <td>${item.dueDate || 'N/A'}</td>
                  <td><span class="status ${(item.status || '').toLowerCase()}">${item.status || 'Unknown'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <p>This report was generated by TaxPro</p>
      </div>
    </div>
  </body>
  </html>
  `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    await browser.close();
    
    console.log('✅ GST Report PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    return pdfBuffer;

  } catch (error) {
    console.error('❌ GST Report PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

module.exports = { generateGSTReportPDF };
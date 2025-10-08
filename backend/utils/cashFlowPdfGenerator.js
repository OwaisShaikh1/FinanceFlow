const puppeteer = require('puppeteer');

async function generateCashFlowPDF(reportData) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
  
  // Calculate totals for Operating, Investing, and Financing Activities
  const totalOperatingActivities = (reportData.operatingActivities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
  const totalInvestingActivities = (reportData.investingActivities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
  const totalFinancingActivities = (reportData.financingActivities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
  
  const netIncreaseInCash = totalOperatingActivities + totalInvestingActivities + totalFinancingActivities;
  
  // Process chart data for visualization
  const processChartData = () => {
    const operatingData = {};
    const investingData = {};
    const financingData = {};
    
    // Process operating activities
    if (reportData.operatingActivities) {
      reportData.operatingActivities.forEach(item => {
        const category = item.name || 'Other Operating';
        operatingData[category] = (item.amount || 0);
      });
    }
    
    // Process investing activities
    if (reportData.investingActivities) {
      reportData.investingActivities.forEach(item => {
        const category = item.name || 'Other Investing';
        investingData[category] = (item.amount || 0);
      });
    }
    
    // Process financing activities
    if (reportData.financingActivities) {
      reportData.financingActivities.forEach(item => {
        const category = item.name || 'Other Financing';
        financingData[category] = (item.amount || 0);
      });
    }
    
    return { operatingData, investingData, financingData };
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
    <title>Cash Flow Statement</title>
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
      
      .cash-flow-container {
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
      
      .subsection-title {
        background: #e2e8f0;
        padding: 12px 20px;
        font-size: 16px;
        font-weight: 600;
        color: #475569;
        border-bottom: 1px solid #cbd5e1;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
      }
      
      th, td {
        padding: 12px 20px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      
      th {
        background: #f1f5f9;
        font-weight: 600;
        color: #475569;
        text-transform: uppercase;
        font-size: 12px;
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
      
      .positive {
        color: #059669;
      }
      
      .negative {
        color: #dc2626;
      }
      
      .total-row {
        background: #f1f5f9 !important;
        font-weight: bold;
        border-top: 2px solid #3b82f6;
      }
      
      .net-increase-section {
        background: linear-gradient(135deg, #059669, #047857);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
      }
      
      .net-increase-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .net-increase-amount {
        font-size: 32px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
      }
      
      .summary-stats {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
        margin: 30px 0;
      }
      
      .stat-card {
        background: #f8fafc;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        border: 2px solid #e2e8f0;
      }
      
      .stat-title {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .stat-amount {
        font-size: 24px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
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
        <div class="report-title">Cash Flow Statement</div>
        <div class="report-subtitle">Cash inflows and outflows for the selected period</div>
        <div class="report-date">For the period ending ${reportData.periodEnding || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      <!-- Cash Flow Statement Main Content -->
      <div class="cash-flow-container">
        
        <!-- Operating Activities -->
        <div class="section">
          <div class="section-title">Cash Flow from Operating Activities</div>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(reportData.operatingActivities || []).map(item => `
                <tr>
                  <td>${item.name || 'Unknown Activity'}</td>
                  <td class="amount ${(item.amount || 0) >= 0 ? 'positive' : 'negative'}">
                    ${formatCurrency(item.amount || 0)}
                  </td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td><strong>Net Cash from Operating Activities</strong></td>
                <td class="amount ${totalOperatingActivities >= 0 ? 'positive' : 'negative'}">
                  <strong>${formatCurrency(totalOperatingActivities)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Investing Activities -->
        <div class="section">
          <div class="section-title">Cash Flow from Investing Activities</div>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(reportData.investingActivities || []).map(item => `
                <tr>
                  <td>${item.name || 'Unknown Activity'}</td>
                  <td class="amount ${(item.amount || 0) >= 0 ? 'positive' : 'negative'}">
                    ${formatCurrency(item.amount || 0)}
                  </td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td><strong>Net Cash from Investing Activities</strong></td>
                <td class="amount ${totalInvestingActivities >= 0 ? 'positive' : 'negative'}">
                  <strong>${formatCurrency(totalInvestingActivities)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Financing Activities -->
        <div class="section">
          <div class="section-title">Cash Flow from Financing Activities</div>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(reportData.financingActivities || []).map(item => `
                <tr>
                  <td>${item.name || 'Unknown Activity'}</td>
                  <td class="amount ${(item.amount || 0) >= 0 ? 'positive' : 'negative'}">
                    ${formatCurrency(item.amount || 0)}
                  </td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td><strong>Net Cash from Financing Activities</strong></td>
                <td class="amount ${totalFinancingActivities >= 0 ? 'positive' : 'negative'}">
                  <strong>${formatCurrency(totalFinancingActivities)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Net Increase in Cash -->
        <div class="net-increase-section">
          <div class="net-increase-title">Net Increase in Cash</div>
          <div class="net-increase-amount">${formatCurrency(netIncreaseInCash)}</div>
        </div>

        <!-- Summary Statistics -->
        <div class="summary-stats">
          <div class="stat-card">
            <div class="stat-title">Operating Cash Flow</div>
            <div class="stat-amount ${totalOperatingActivities >= 0 ? 'positive' : 'negative'}">
              ${formatCurrency(totalOperatingActivities)}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Investing Cash Flow</div>
            <div class="stat-amount ${totalInvestingActivities >= 0 ? 'positive' : 'negative'}">
              ${formatCurrency(totalInvestingActivities)}
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Financing Cash Flow</div>
            <div class="stat-amount ${totalFinancingActivities >= 0 ? 'positive' : 'negative'}">
              ${formatCurrency(totalFinancingActivities)}
            </div>
          </div>
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
    
    console.log('✅ Cash Flow PDF generated successfully, size:', pdfBuffer.length, 'bytes');
    return pdfBuffer;

  } catch (error) {
    console.error('❌ Cash Flow PDF generation error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

module.exports = { generateCashFlowPDF };
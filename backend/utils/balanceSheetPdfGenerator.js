const puppeteer = require('puppeteer');

async function generateBalanceSheetPDF(reportData) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
  
  // Calculate totals for Assets, Liabilities, and Equity
  const totalCurrentAssets = reportData.currentAssets?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalFixedAssets = reportData.fixedAssets?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalAssets = totalCurrentAssets + totalFixedAssets;
  
  const totalCurrentLiabilities = reportData.currentLiabilities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalLongTermLiabilities = reportData.longTermLiabilities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;
  
  const totalEquity = reportData.equity?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  
  // Process chart data for visualization
  const processChartData = () => {
    const assetCategories = {};
    const liabilityCategories = {};
    
    // Process current assets
    if (reportData.currentAssets) {
      reportData.currentAssets.forEach(item => {
        const category = item.name || 'Other Current Assets';
        assetCategories[category] = (item.amount || 0);
      });
    }
    
    // Process fixed assets
    if (reportData.fixedAssets) {
      reportData.fixedAssets.forEach(item => {
        const category = item.name || 'Other Fixed Assets';
        assetCategories[category] = (item.amount || 0);
      });
    }
    
    // Process current liabilities
    if (reportData.currentLiabilities) {
      reportData.currentLiabilities.forEach(item => {
        const category = item.name || 'Other Current Liabilities';
        liabilityCategories[category] = (item.amount || 0);
      });
    }
    
    // Process long term liabilities
    if (reportData.longTermLiabilities) {
      reportData.longTermLiabilities.forEach(item => {
        const category = item.name || 'Other Long Term Liabilities';
        liabilityCategories[category] = (item.amount || 0);
      });
    }
    
    return { assetCategories, liabilityCategories };
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
    <title>Balance Sheet Report</title>
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
      
      .taxpro-brand {
        font-size: 14px;
        color: #1e40af;
        font-weight: 600;
        margin-bottom: 10px;
      }
      
      .balance-sheet-container {
        display: flex;
        gap: 30px;
        margin-bottom: 30px;
      }
      
      .left-side, .right-side {
        flex: 1;
      }
      
      .section {
        margin-bottom: 25px;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #1f2937;
        background: #f3f4f6;
        padding: 12px 15px;
        border-left: 4px solid #2563eb;
        margin-bottom: 10px;
      }
      
      .subsection-title {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        padding: 8px 15px;
        background: #f9fafb;
        border-left: 3px solid #6b7280;
        margin: 10px 0 5px 0;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }
      
      th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #d1d5db;
      }
      
      tr:hover {
        background-color: #f9fafb;
      }
      
      .amount {
        text-align: right;
        font-family: 'Courier New', monospace;
        font-weight: 500;
      }
      
      .total-row {
        font-weight: bold;
        background-color: #f3f4f6;
        border-top: 2px solid #d1d5db;
      }
      
      .grand-total {
        font-weight: bold;
        font-size: 16px;
        background-color: #dbeafe;
        color: #1e40af;
        border-top: 3px solid #2563eb;
      }
      
      .summary {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #0ea5e9;
        margin: 20px 0;
      }
      
      .summary h3 {
        color: #0c4a6e;
        margin-bottom: 15px;
        font-size: 18px;
      }
      
      .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #bae6fd;
      }
      
      .summary-item:last-child {
        border-bottom: none;
        font-weight: bold;
        font-size: 16px;
        padding-top: 12px;
        border-top: 2px solid #0ea5e9;
      }
      
      .chart-analysis {
        margin-top: 30px;
        page-break-before: always;
      }
      
      .chart-section {
        margin-bottom: 25px;
        padding: 20px;
        background: #fafafa;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }
      
      .chart-title {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid #d1d5db;
      }
      
      .chart-data {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      
      .data-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        background: white;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
      }
      
      .footer {
        margin-top: 40px;
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #d1d5db;
        color: #6b7280;
        font-size: 12px;
      }
      
      @media print {
        .container {
          max-width: 100%;
          padding: 0;
        }
        
        .page-break {
          page-break-before: always;
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
        <div class="report-title">Balance Sheet</div>
        <div class="report-subtitle">Assets, Liabilities, and Equity</div>
        <div class="report-date">As of ${reportData.asOfDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      <!-- Balance Sheet Main Content -->
      <div class="balance-sheet-container">
        <!-- Left Side - Assets -->
        <div class="left-side">
          <!-- Current Assets -->
          <div class="section">
            <div class="section-title">ASSETS</div>
            <div class="subsection-title">Current Assets</div>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.currentAssets?.map(asset => `
                  <tr>
                    <td>${asset.name}</td>
                    <td class="amount">${formatCurrency(asset.amount || 0)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="2">No current assets data available</td></tr>'}
                <tr class="total-row">
                  <td>Total Current Assets</td>
                  <td class="amount">${formatCurrency(totalCurrentAssets)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fixed Assets -->
          <div class="section">
            <div class="subsection-title">Fixed Assets</div>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.fixedAssets?.map(asset => `
                  <tr>
                    <td>${asset.name}</td>
                    <td class="amount">${formatCurrency(asset.amount || 0)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="2">No fixed assets data available</td></tr>'}
                <tr class="total-row">
                  <td>Total Fixed Assets</td>
                  <td class="amount">${formatCurrency(totalFixedAssets)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Assets -->
          <div class="section">
            <table>
              <tbody>
                <tr class="grand-total">
                  <td>TOTAL ASSETS</td>
                  <td class="amount">${formatCurrency(totalAssets)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Side - Liabilities & Equity -->
        <div class="right-side">
          <!-- Current Liabilities -->
          <div class="section">
            <div class="section-title">LIABILITIES & EQUITY</div>
            <div class="subsection-title">Current Liabilities</div>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.currentLiabilities?.map(liability => `
                  <tr>
                    <td>${liability.name}</td>
                    <td class="amount">${formatCurrency(liability.amount || 0)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="2">No current liabilities data available</td></tr>'}
                <tr class="total-row">
                  <td>Total Current Liabilities</td>
                  <td class="amount">${formatCurrency(totalCurrentLiabilities)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Long Term Liabilities -->
          <div class="section">
            <div class="subsection-title">Long Term Liabilities</div>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.longTermLiabilities?.map(liability => `
                  <tr>
                    <td>${liability.name}</td>
                    <td class="amount">${formatCurrency(liability.amount || 0)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="2">No long term liabilities data available</td></tr>'}
                <tr class="total-row">
                  <td>Total Long Term Liabilities</td>
                  <td class="amount">${formatCurrency(totalLongTermLiabilities)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Equity -->
          <div class="section">
            <div class="subsection-title">Equity</div>
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.equity?.map(equity => `
                  <tr>
                    <td>${equity.name}</td>
                    <td class="amount">${formatCurrency(equity.amount || 0)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="2">No equity data available</td></tr>'}
                <tr class="total-row">
                  <td>Total Equity</td>
                  <td class="amount">${formatCurrency(totalEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Liabilities & Equity -->
          <div class="section">
            <table>
              <tbody>
                <tr class="grand-total">
                  <td>TOTAL LIABILITIES & EQUITY</td>
                  <td class="amount">${formatCurrency(totalLiabilitiesAndEquity)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="summary">
        <h3>Balance Sheet Summary</h3>
        <div class="summary-item">
          <span>Total Assets:</span>
          <span>${formatCurrency(totalAssets)}</span>
        </div>
        <div class="summary-item">
          <span>Total Liabilities:</span>
          <span>${formatCurrency(totalLiabilities)}</span>
        </div>
        <div class="summary-item">
          <span>Total Equity:</span>
          <span>${formatCurrency(totalEquity)}</span>
        </div>
        <div class="summary-item">
          <span>Balance Check:</span>
          <span>${totalAssets === totalLiabilitiesAndEquity ? '✓ Balanced' : '⚠ Unbalanced'}</span>
        </div>
      </div>

      <!-- Chart Analysis Section -->
      <div class="chart-analysis page-break">
        <div class="section-title">Financial Analysis & Chart Data</div>
        
        <div class="chart-section">
          <div class="chart-title">Asset Composition</div>
          <div class="chart-data">
            ${Object.entries(chartData.assetCategories).map(([category, amount]) => `
              <div class="data-item">
                <span>${category}</span>
                <span>${formatCurrency(amount)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="chart-section">
          <div class="chart-title">Liability & Equity Composition</div>
          <div class="chart-data">
            ${Object.entries(chartData.liabilityCategories).map(([category, amount]) => `
              <div class="data-item">
                <span>${category}</span>
                <span>${formatCurrency(amount)}</span>
              </div>
            `).join('')}
            ${reportData.equity?.map(equity => `
              <div class="data-item">
                <span>${equity.name} (Equity)</span>
                <span>${formatCurrency(equity.amount || 0)}</span>
              </div>
            `).join('') || ''}
          </div>
        </div>

        <div class="chart-section">
          <div class="chart-title">Key Financial Ratios</div>
          <div class="chart-data">
            <div class="data-item">
              <span>Current Ratio</span>
              <span>${totalCurrentLiabilities > 0 ? (totalCurrentAssets / totalCurrentLiabilities).toFixed(2) : 'N/A'}</span>
            </div>
            <div class="data-item">
              <span>Debt-to-Equity Ratio</span>
              <span>${totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A'}</span>
            </div>
            <div class="data-item">
              <span>Asset-to-Equity Ratio</span>
              <span>${totalEquity > 0 ? (totalAssets / totalEquity).toFixed(2) : 'N/A'}</span>
            </div>
            <div class="data-item">
              <span>Equity Percentage</span>
              <span>${totalAssets > 0 ? ((totalEquity / totalAssets) * 100).toFixed(1) + '%' : 'N/A'}</span>
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
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    console.error('Error generating balance sheet PDF:', error);
    throw error;
  }
}

module.exports = { generateBalanceSheetPDF };
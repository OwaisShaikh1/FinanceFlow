const puppeteer = require('puppeteer');

async function generateProfitLossPDF(reportData) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
  
  // Calculate totals
  const totalRevenue = reportData.revenue?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalExpenses = reportData.expenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const netProfit = totalRevenue - totalExpenses;
  
  // Process chart data for visualization
  const processChartData = () => {
    const incomeCategories = {};
    const expenseCategories = {};
    
    // Process revenue data
    if (reportData.revenue) {
      reportData.revenue.forEach(item => {
        const category = item.category || 'Other Income';
        incomeCategories[category] = (incomeCategories[category] || 0) + (item.amount || 0);
      });
    }
    
    // Process expense data
    if (reportData.expenses) {
      reportData.expenses.forEach(item => {
        const category = item.category || 'Other Expenses';
        expenseCategories[category] = (expenseCategories[category] || 0) + (item.amount || 0);
      });
    }
    
    return { incomeCategories, expenseCategories };
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

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profit & Loss Statement - Tax Pro</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
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
        border-bottom: 3px solid #e67e22;
        padding-bottom: 20px;
      }
      
      .company-name {
        font-size: 32px;
        font-weight: bold;
        color: #e67e22;
        margin-bottom: 8px;
      }
      
      .company-tagline {
        font-size: 14px;
        color: #666;
        margin-bottom: 15px;
      }
      
      .report-title {
        font-size: 24px;
        font-weight: bold;
        color: #2c3e50;
        margin: 15px 0 5px 0;
      }
      
      .report-period {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .report-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }
      
      .business-info {
        text-align: left;
      }
      
      .business-name {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
      }
      
      .generated-date {
        text-align: right;
        font-size: 12px;
        color: #666;
      }
      
      .statement-section {
        margin-bottom: 30px;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 15px;
        padding: 10px;
        background: #f8f9fa;
        border-left: 4px solid #e67e22;
      }
      
      .statement-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .statement-table th {
        background: #34495e;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: bold;
      }
      
      .statement-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
      }
      
      .statement-table tr:nth-child(even) {
        background: #f8f9fa;
      }
      
      .statement-table tr:hover {
        background: #e8f4fd;
      }
      
      .amount-cell {
        text-align: right;
        font-weight: bold;
        color: #2c3e50;
      }
      
      .percentage-cell {
        text-align: center;
        color: #666;
        font-size: 12px;
      }
      
      .total-row {
        border-top: 2px solid #34495e;
        font-weight: bold;
        background: #ecf0f1 !important;
      }
      
      .net-profit {
        margin-top: 20px;
        padding: 15px;
        background: ${netProfit >= 0 ? '#d5f4e6' : '#ffeaa7'};
        border: 2px solid ${netProfit >= 0 ? '#00b894' : '#fdcb6e'};
        border-radius: 8px;
        text-align: center;
      }
      
      .net-profit-label {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .net-profit-amount {
        font-size: 24px;
        font-weight: bold;
        color: ${netProfit >= 0 ? '#00b894' : '#e17055'};
      }
      
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e67e22;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      
      .chart-section {
        margin-top: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .chart-title {
        font-size: 18px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .chart-data {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .chart-category {
        background: white;
        padding: 15px;
        border-radius: 6px;
        border-left: 4px solid #e67e22;
      }
      
      .category-header {
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 8px;
        font-size: 14px;
      }
      
      .category-item {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 12px;
      }
      
      .category-name {
        color: #555;
      }
      
      .category-value {
        font-weight: bold;
        color: #e67e22;
      }
      
      .income-category {
        border-left-color: #27ae60;
      }
      
      .income-category .category-value {
        color: #27ae60;
      }
      
      .expense-category {
        border-left-color: #e74c3c;
      }
      
      .expense-category .category-value {
        color: #e74c3c;
      }
      
      .watermark {
        position: absolute;
        bottom: 20px;
        right: 20px;
        opacity: 0.1;
        font-size: 48px;
        font-weight: bold;
        color: #e67e22;
        transform: rotate(-45deg);
        pointer-events: none;
      }
      
      @media print {
        .container {
          margin: 0;
          padding: 15px;
        }
        
        .watermark {
          opacity: 0.05;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="company-name">Tax Pro</div>
        <div class="company-tagline">Professional Accounting & Tax Management</div>
        <div class="report-title">Profit & Loss Statement</div>
        <div class="report-period">${reportData.periodDescription || 'Financial Report'}</div>
      </div>
      
      <!-- Report Meta Information -->
      <div class="report-meta">
        <div class="business-info">
          <div class="business-name">${reportData.businessName || 'Business Name'}</div>
        </div>
        <div class="generated-date">
          <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
          <div><strong>Time:</strong> ${new Date().toLocaleTimeString('en-IN')}</div>
        </div>
      </div>
      
      <!-- Revenue Section -->
      <div class="statement-section">
        <div class="section-title">Revenue</div>
        <table class="statement-table">
          <thead>
            <tr>
              <th style="width: 60%">Account</th>
              <th style="width: 25%">Amount</th>
              <th style="width: 15%">%</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.revenue?.map(item => `
              <tr>
                <td>${item.account || item.name}</td>
                <td class="amount-cell">${formatCurrency(item.amount || 0)}</td>
                <td class="percentage-cell">${((item.amount / totalRevenue) * 100).toFixed(1)}%</td>
              </tr>
            `).join('') || '<tr><td colspan="3" style="text-align: center; color: #666;">No revenue data available</td></tr>'}
            <tr class="total-row">
              <td><strong>Total Revenue</strong></td>
              <td class="amount-cell"><strong>${formatCurrency(totalRevenue)}</strong></td>
              <td class="percentage-cell"><strong>100.0%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Expenses Section -->
      <div class="statement-section">
        <div class="section-title">Expenses</div>
        <table class="statement-table">
          <thead>
            <tr>
              <th style="width: 60%">Account</th>
              <th style="width: 25%">Amount</th>
              <th style="width: 15%">%</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.expenses?.map(item => `
              <tr>
                <td>${item.account || item.name}</td>
                <td class="amount-cell">${formatCurrency(item.amount || 0)}</td>
                <td class="percentage-cell">${totalRevenue > 0 ? ((item.amount / totalRevenue) * 100).toFixed(1) : '0.0'}%</td>
              </tr>
            `).join('') || '<tr><td colspan="3" style="text-align: center; color: #666;">No expense data available</td></tr>'}
            <tr class="total-row">
              <td><strong>Total Expenses</strong></td>
              <td class="amount-cell"><strong>${formatCurrency(totalExpenses)}</strong></td>
              <td class="percentage-cell"><strong>${totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : '0.0'}%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Net Profit Section -->
      <div class="net-profit">
        <div class="net-profit-label">Net ${netProfit >= 0 ? 'Profit' : 'Loss'}</div>
        <div class="net-profit-amount">${formatCurrency(Math.abs(netProfit))}</div>
      </div>
      
      <!-- Chart Data Section -->
      <div class="chart-section">
        <div class="chart-title">Income & Expense Breakdown</div>
        <div class="chart-data">
          <!-- Income Categories -->
          <div class="chart-category income-category">
            <div class="category-header">Income Sources</div>
            ${Object.entries(chartData.incomeCategories)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([name, amount]) => `
                <div class="category-item">
                  <span class="category-name">${name}</span>
                  <span class="category-value">${formatCurrency(amount)}</span>
                </div>
              `).join('')}
            ${Object.keys(chartData.incomeCategories).length === 0 ? '<div class="category-item"><span class="category-name">No income data available</span></div>' : ''}
          </div>
          
          <!-- Expense Categories -->
          <div class="chart-category expense-category">
            <div class="category-header">Expense Categories</div>
            ${Object.entries(chartData.expenseCategories)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([name, amount]) => `
                <div class="category-item">
                  <span class="category-name">${name}</span>
                  <span class="category-value">${formatCurrency(amount)}</span>
                </div>
              `).join('')}
            ${Object.keys(chartData.expenseCategories).length === 0 ? '<div class="category-item"><span class="category-name">No expense data available</span></div>' : ''}
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div><strong>Tax Pro Accounting</strong> - Professional Financial Solutions</div>
        <div>Generated on ${new Date().toLocaleString('en-IN')} | Confidential Business Document</div>
      </div>
    </div>
    
    <!-- Watermark -->
    <div class="watermark">TAX PRO</div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true
    });

    await browser.close();
    return pdf;
  } catch (error) {
    console.error('Error generating P&L PDF:', error);
    throw error;
  }
}

module.exports = { generateProfitLossPDF };
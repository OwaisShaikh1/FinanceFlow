const ExcelJS = require('exceljs');

class ExcelGenerator {
  constructor() {
    this.workbook = null;
  }

  // Initialize new workbook
  createWorkbook() {
    this.workbook = new ExcelJS.Workbook();
    return this.workbook;
  }

  // Main entry point for generating financial reports
  async generateFinancialReport(data, reportType) {
    this.createWorkbook();
    
    try {
      switch (reportType) {
        case 'profit-loss':
          await this.generateProfitLossSheet(data);
          break;
        case 'balance-sheet':
          await this.generateBalanceSheet(data);
          break;
        case 'cash-flow':
          await this.generateCashFlowSheet(data);
          break;
        default:
          throw new Error(`Unsupported report type: ${reportType}`);
      }

      return await this.workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw error;
    }
  }

  // Generate Profit & Loss Statement
  async generateProfitLossSheet(data) {
    const worksheet = this.workbook.addWorksheet('Profit & Loss');
    
    // Set up columns
    worksheet.columns = [
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Amount (₹)', key: 'amount', width: 20 },
      { header: 'Percentage', key: 'percentage', width: 15 }
    ];

    // Add title and headers
    this.addSheetTitle(worksheet, 'PROFIT & LOSS STATEMENT', 'For the period: December 31, 2024');

    // Revenue Section
    const serviceRevenue = data.revenue || 287000;
    const otherIncome = data.otherIncome || 5000;
    const totalRevenue = serviceRevenue + otherIncome;

    worksheet.addRow(['REVENUE', '', '']);
    worksheet.addRow(['Service Revenue', serviceRevenue, this.calculatePercentage(serviceRevenue, totalRevenue)]);
    worksheet.addRow(['Other Income', otherIncome, this.calculatePercentage(otherIncome, totalRevenue)]);
    worksheet.addRow(['Total Revenue', totalRevenue, '100.0%']);
    worksheet.addRow(['', '', '']);

    // Expenses Section
    const expenses = this.getDetailedExpenses(data);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);

    worksheet.addRow(['EXPENSES', '', '']);
    expenses.forEach(expense => {
      worksheet.addRow([expense.name, expense.value, this.calculatePercentage(expense.value, totalRevenue)]);
    });
    worksheet.addRow(['Total Expenses', totalExpenses, this.calculatePercentage(totalExpenses, totalRevenue)]);
    worksheet.addRow(['', '', '']);

    // Net Profit
    const netProfit = totalRevenue - totalExpenses;
    worksheet.addRow(['NET PROFIT', netProfit, this.calculatePercentage(netProfit, totalRevenue)]);

    // Apply formatting
    this.formatFinancialSheet(worksheet);
    this.addChartData(worksheet, 'expenses', expenses);
  }

  // Generate Balance Sheet
  async generateBalanceSheet(data) {
    console.log('🏦 Generating Balance Sheet with data:', JSON.stringify(data, null, 2));
    
    const worksheet = this.workbook.addWorksheet('Balance Sheet');
    
    // Set up columns
    worksheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Amount (₹)', key: 'amount', width: 20 }
    ];

    // Add title and headers
    this.addSheetTitle(worksheet, 'BALANCE SHEET', 'As of December 31, 2024');

    // Assets Section
    const currentAssets = this.getCurrentAssets(data);
    const fixedAssets = this.getFixedAssets(data);
    const totalAssets = currentAssets.total + fixedAssets.total;

    worksheet.addRow(['ASSETS', '']);
    worksheet.addRow(['Current Assets', '']);
    currentAssets.items.forEach(asset => {
      worksheet.addRow([asset.name, asset.value]);
    });
    worksheet.addRow(['Total Current Assets', currentAssets.total]);
    worksheet.addRow(['', '']);

    worksheet.addRow(['Fixed Assets', '']);
    fixedAssets.items.forEach(asset => {
      worksheet.addRow([asset.name, asset.value]);
    });
    worksheet.addRow(['Total Fixed Assets', fixedAssets.total]);
    worksheet.addRow(['', '']);
    worksheet.addRow(['TOTAL ASSETS', totalAssets]);
    worksheet.addRow(['', '']);

    // Liabilities & Equity Section
    const liabilities = this.getLiabilities(data);
    const equity = this.getEquity(data);
    const totalLiabEquity = liabilities.total + equity.total;

    worksheet.addRow(['LIABILITIES & EQUITY', '']);
    worksheet.addRow(['Current Liabilities', '']);
    liabilities.current.forEach(liability => {
      worksheet.addRow([liability.name, liability.value]);
    });
    worksheet.addRow(['Total Current Liabilities', liabilities.currentTotal]);
    worksheet.addRow(['', '']);

    worksheet.addRow(['Long-term Liabilities', '']);
    liabilities.longTerm.forEach(liability => {
      worksheet.addRow([liability.name, liability.value]);
    });
    worksheet.addRow(['Total Long-term Liabilities', liabilities.longTermTotal]);
    worksheet.addRow(['', '']);

    worksheet.addRow(['Equity', '']);
    equity.items.forEach(equityItem => {
      worksheet.addRow([equityItem.name, equityItem.value]);
    });
    worksheet.addRow(['Total Equity', equity.total]);
    worksheet.addRow(['', '']);
    worksheet.addRow(['TOTAL LIABILITIES & EQUITY', totalLiabEquity]);

    console.log(`📊 Balance Sheet completed with ${worksheet.rowCount} rows, Total Assets: ₹${totalAssets.toLocaleString()}`);

    // Apply formatting
    this.formatFinancialSheet(worksheet);
    this.addChartData(worksheet, 'assets', [...currentAssets.items, ...fixedAssets.items]);
  }

  // Generate Cash Flow Statement
  async generateCashFlowSheet(data) {
    const worksheet = this.workbook.addWorksheet('Cash Flow');
    
    // Set up columns
    worksheet.columns = [
      { header: 'Activity', key: 'activity', width: 35 },
      { header: 'Amount (₹)', key: 'amount', width: 20 }
    ];

    // Add title and headers
    this.addSheetTitle(worksheet, 'CASH FLOW STATEMENT', 'For the period: December 31, 2024');

    // Operating Activities
    const operatingActivities = this.getOperatingActivities(data);
    worksheet.addRow(['OPERATING ACTIVITIES', '']);
    operatingActivities.forEach(activity => {
      worksheet.addRow([activity.name, activity.value]);
    });
    const netOperating = operatingActivities.reduce((sum, act) => sum + act.value, 0);
    worksheet.addRow(['Net Cash from Operating Activities', netOperating]);
    worksheet.addRow(['', '']);

    // Investing Activities
    const investingActivities = this.getInvestingActivities(data);
    worksheet.addRow(['INVESTING ACTIVITIES', '']);
    investingActivities.forEach(activity => {
      worksheet.addRow([activity.name, activity.value]);
    });
    const netInvesting = investingActivities.reduce((sum, act) => sum + act.value, 0);
    worksheet.addRow(['Net Cash from Investing Activities', netInvesting]);
    worksheet.addRow(['', '']);

    // Financing Activities
    const financingActivities = this.getFinancingActivities(data);
    worksheet.addRow(['FINANCING ACTIVITIES', '']);
    financingActivities.forEach(activity => {
      worksheet.addRow([activity.name, activity.value]);
    });
    const netFinancing = financingActivities.reduce((sum, act) => sum + act.value, 0);
    worksheet.addRow(['Net Cash from Financing Activities', netFinancing]);
    worksheet.addRow(['', '']);

    // Net Change in Cash
    const netCashChange = netOperating + netInvesting + netFinancing;
    worksheet.addRow(['NET CHANGE IN CASH', netCashChange]);

    // Apply formatting
    this.formatFinancialSheet(worksheet);
  }

  // Helper Methods for Data Extraction

  getDetailedExpenses(data) {
    return [
      { name: 'Cost of Goods Sold', value: data.cogs || 120000 },
      { name: 'Office Rent', value: data.rent || 36000 },
      { name: 'Salaries & Wages', value: data.salaries || 85000 },
      { name: 'Utilities', value: data.utilities || 7200 },
      { name: 'Marketing', value: data.marketing || 18000 },
      { name: 'Professional Services', value: data.professional || 8500 },
      { name: 'Other Expenses', value: data.other || 4300 }
    ];
  }

  getCurrentAssets(data) {
    const items = [
      { name: 'Cash in Hand', value: data.cashInHand || 50000 },
      { name: 'Bank Account', value: data.bankAccount || 285000 },
      { name: 'Accounts Receivable', value: data.receivables || 125000 },
      { name: 'Inventory', value: data.inventory || 85000 }
    ];
    return {
      items,
      total: items.reduce((sum, item) => sum + item.value, 0)
    };
  }

  getFixedAssets(data) {
    const items = [
      { name: 'Office Equipment', value: data.officeEquipment || 150000 },
      { name: 'Furniture & Fixtures', value: data.furniture || 75000 },
      { name: 'Computer Systems', value: data.computerSystems || 120000 }
    ];
    return {
      items,
      total: items.reduce((sum, item) => sum + item.value, 0)
    };
  }

  getLiabilities(data) {
    const current = [
      { name: 'Accounts Payable', value: data.accountsPayable || 85000 },
      { name: 'Accrued Expenses', value: data.accruedExpenses || 25000 },
      { name: 'Short-term Loans', value: data.shortTermLoans || 50000 }
    ];
    
    const longTerm = [
      { name: 'Long-term Debt', value: data.longTermDebt || 200000 },
      { name: 'Equipment Loan', value: data.equipmentLoan || 75000 }
    ];

    return {
      current,
      longTerm,
      currentTotal: current.reduce((sum, item) => sum + item.value, 0),
      longTermTotal: longTerm.reduce((sum, item) => sum + item.value, 0),
      total: current.reduce((sum, item) => sum + item.value, 0) + longTerm.reduce((sum, item) => sum + item.value, 0)
    };
  }

  getEquity(data) {
    const items = [
      { name: 'Owner\'s Capital', value: data.ownersCapital || 400000 },
      { name: 'Retained Earnings', value: data.retainedEarnings || 150000 }
    ];
    return {
      items,
      total: items.reduce((sum, item) => sum + item.value, 0)
    };
  }

  getOperatingActivities(data) {
    return [
      { name: 'Net Income', value: data.netIncome || 450000 },
      { name: 'Depreciation', value: data.depreciation || 25000 },
      { name: 'Accounts Receivable Change', value: data.arChange || -15000 },
      { name: 'Inventory Change', value: data.inventoryChange || -10000 },
      { name: 'Accounts Payable Change', value: data.apChange || 6000 }
    ];
  }

  getInvestingActivities(data) {
    return [
      { name: 'Equipment Purchase', value: data.equipmentPurchase || -75000 },
      { name: 'Investment Sale', value: data.investmentSale || 20000 }
    ];
  }

  getFinancingActivities(data) {
    return [
      { name: 'Loan Repayment', value: data.loanRepayment || -30000 },
      { name: 'Dividend Payment', value: data.dividendPayment || -25000 }
    ];
  }

  // Utility Methods

  calculatePercentage(value, total) {
    return total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0.0%';
  }

  addSheetTitle(worksheet, title, subtitle) {
    // Title
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = title;
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Subtitle
    if (subtitle) {
      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A2').value = subtitle;
      worksheet.getCell('A2').alignment = { horizontal: 'center' };
    }

    // Empty row
    worksheet.addRow(['', '', '']);
  }

  formatFinancialSheet(worksheet) {
    // Format currency columns
    worksheet.getColumn('B').numFmt = '₹#,##0.00';
    
    // Style section headers
    worksheet.eachRow((row, rowNumber) => {
      if (row.getCell(1).value && typeof row.getCell(1).value === 'string') {
        const cellValue = row.getCell(1).value.toUpperCase();
        
        // Major section headers (ASSETS, LIABILITIES, etc.)
        if (cellValue.includes('ASSETS') || cellValue.includes('LIABILITIES') || 
            cellValue.includes('REVENUE') || cellValue.includes('EXPENSES') || 
            cellValue.includes('ACTIVITIES')) {
          row.font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F3FF' } };
        }
        
        // Total rows
        if (cellValue.includes('TOTAL') || cellValue.includes('NET')) {
          row.font = { bold: true, color: { argb: 'FF009900' } };
          row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6FFE6' } };
        }
      }
    });
  }

  addChartData(worksheet, chartType, data) {
    const startCol = worksheet.columnCount + 2;
    const colLetter = String.fromCharCode(65 + startCol - 1);
    
    // Add chart data title
    worksheet.getCell(`${colLetter}1`).value = `${chartType.toUpperCase()} BREAKDOWN DATA`;
    worksheet.getCell(`${colLetter}1`).font = { bold: true, size: 12 };
    
    // Add headers
    worksheet.getCell(`${colLetter}3`).value = 'Category';
    worksheet.getCell(`${String.fromCharCode(65 + startCol)}3`).value = 'Amount (₹)';
    
    // Add data
    data.forEach((item, index) => {
      const row = 4 + index;
      worksheet.getCell(`${colLetter}${row}`).value = item.name;
      worksheet.getCell(`${String.fromCharCode(65 + startCol)}${row}`).value = item.value;
    });

    // Add chart instructions
    const instructionsRow = 4 + data.length + 2;
    worksheet.getCell(`${colLetter}${instructionsRow}`).value = 'CHART INSTRUCTIONS:';
    worksheet.getCell(`${colLetter}${instructionsRow}`).font = { bold: true };
    worksheet.getCell(`${colLetter}${instructionsRow + 1}`).value = `1. Select range ${colLetter}3:${String.fromCharCode(65 + startCol)}${3 + data.length}`;
    worksheet.getCell(`${colLetter}${instructionsRow + 2}`).value = '2. Insert > Charts > Pie Chart';
    worksheet.getCell(`${colLetter}${instructionsRow + 3}`).value = '3. Customize as needed';
  }
}

module.exports = new ExcelGenerator();
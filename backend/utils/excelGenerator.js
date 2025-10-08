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
    const businessName = data.businessName || 'Your Business';
    const period = data.pageTitle ? data.pageTitle.replace('Profit & Loss Statement', '').trim() : 'Financial Period';
    this.addSheetTitle(worksheet, `${businessName.toUpperCase()} - PROFIT & LOSS STATEMENT`, `Generated on: ${new Date().toLocaleDateString()}`);

    // Use summary data if available, otherwise use default values
    const summary = data.summary || {};
    const totalIncome = summary.totalIncome || data.revenue || 287000;
    const totalExpensesAmount = summary.totalExpenses || data.expenses || 150000;
    const totalRevenue = totalIncome;

    worksheet.addRow(['REVENUE', '', '']);
    worksheet.addRow(['Total Income', totalIncome, '100.0%']);
    worksheet.addRow(['', '', '']);

    // Expenses Section - Use summary or default breakdown
    const expenseBreakdown = this.getDetailedExpenses(data);
    
    worksheet.addRow(['EXPENSES', '', '']);
    expenseBreakdown.forEach(expense => {
      worksheet.addRow([expense.name, expense.value, this.calculatePercentage(expense.value, totalRevenue)]);
    });
    worksheet.addRow(['Total Expenses', totalExpensesAmount, this.calculatePercentage(totalExpensesAmount, totalRevenue)]);
    worksheet.addRow(['', '', '']);

    // Net Profit
    const netProfit = totalRevenue - totalExpensesAmount;
    worksheet.addRow(['NET PROFIT', netProfit, this.calculatePercentage(netProfit, totalRevenue)]);

    // Apply formatting
    this.formatFinancialSheet(worksheet);
    
    // Add charts to separate worksheets for better visualization
    await this.addIncomeExpenseCharts(totalIncome, totalExpensesAmount, expenseBreakdown);
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

  // Add Income vs Expenses Charts to separate sheets
  async addIncomeExpenseCharts(totalIncome, totalExpenses, expenseBreakdown) {
    // Create Charts worksheet
    const chartSheet = this.workbook.addWorksheet('Charts & Analysis');
    
    // Set up the chart sheet layout
    chartSheet.columns = [
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Amount (₹)', key: 'amount', width: 20 },
      { header: 'Percentage', key: 'percentage', width: 15 }
    ];

    // Add title
    chartSheet.getCell('A1').value = 'FINANCIAL ANALYSIS CHARTS';
    chartSheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF0066CC' } };
    chartSheet.mergeCells('A1:C1');
    chartSheet.getRow(1).height = 30;
    
    // Income vs Expenses Overview
    chartSheet.addRow(['', '', '']);
    chartSheet.getCell('A3').value = 'INCOME vs EXPENSES OVERVIEW';
    chartSheet.getCell('A3').font = { bold: true, size: 14 };
    chartSheet.mergeCells('A3:C3');
    
    const overviewData = [
      ['Income', totalIncome, this.calculatePercentage(totalIncome, totalIncome + totalExpenses)],
      ['Expenses', totalExpenses, this.calculatePercentage(totalExpenses, totalIncome + totalExpenses)]
    ];
    
    chartSheet.addRow(['Category', 'Amount (₹)', 'Percentage']);
    overviewData.forEach(row => {
      chartSheet.addRow(row);
    });
    
    // Add some spacing
    chartSheet.addRow(['', '', '']);
    chartSheet.addRow(['', '', '']);
    
    // Expense Breakdown Section
    chartSheet.getCell('A9').value = 'EXPENSE BREAKDOWN';
    chartSheet.getCell('A9').font = { bold: true, size: 14 };
    chartSheet.mergeCells('A9:C9');
    
    chartSheet.addRow(['Expense Category', 'Amount (₹)', '% of Total Income']);
    expenseBreakdown.forEach(expense => {
      chartSheet.addRow([
        expense.name, 
        expense.value, 
        this.calculatePercentage(expense.value, totalIncome)
      ]);
    });
    
    // Add chart creation instructions
    const instructionsStartRow = 11 + expenseBreakdown.length;
    chartSheet.addRow(['', '', '']);
    chartSheet.addRow(['', '', '']);
    
    chartSheet.getCell(`A${instructionsStartRow + 2}`).value = 'CHART CREATION GUIDE:';
    chartSheet.getCell(`A${instructionsStartRow + 2}`).font = { bold: true, color: { argb: 'FF0066CC' } };
    
    const instructions = [
      '1. PIE CHART (Income vs Expenses):',
      `   • Select range A5:B6`,
      '   • Insert > Charts > Pie Chart',
      '',
      '2. BAR CHART (Expense Breakdown):',
      `   • Select range A11:B${10 + expenseBreakdown.length}`,
      '   • Insert > Charts > Column Chart',
      '',
      '3. For better visualization:',
      '   • Add chart titles and data labels',
      '   • Use different colors for each category',
      '   • Consider adding a combo chart for trends'
    ];
    
    instructions.forEach((instruction, index) => {
      const row = instructionsStartRow + 3 + index;
      chartSheet.getCell(`A${row}`).value = instruction;
      if (instruction.includes('•')) {
        chartSheet.getCell(`A${row}`).font = { italic: true };
      }
    });
    
    // Apply formatting to the chart sheet
    this.formatChartSheet(chartSheet);
  }

  // Format the charts worksheet
  formatChartSheet(worksheet) {
    // Style header rows
    const headerRows = [5, 11];
    headerRows.forEach(rowNum => {
      for (let col = 1; col <= 3; col++) {
        const cell = worksheet.getCell(rowNum, col);
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0066CC' }
        };
      }
    });
    
    // Add borders to data sections
    const rowCount = worksheet.rowCount;
    for (let row = 5; row <= rowCount; row++) {
      for (let col = 1; col <= 3; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Format currency cells
        if (col === 2 && cell.value && typeof cell.value === 'number') {
          cell.numFmt = '₹#,##0';
        }
      }
    }
  }

  addChartData(worksheet, chartType, data) {
    // This method is kept for backward compatibility
    // The new chart functionality is in addIncomeExpenseCharts
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
  }
}

module.exports = new ExcelGenerator();
const ExcelJS = require('exceljs');

async function generateBalanceSheetExcel(reportData, chartData) {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Calculate totals
    const totalCurrentAssets = reportData.currentAssets?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    const totalFixedAssets = reportData.fixedAssets?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    const totalAssets = totalCurrentAssets + totalFixedAssets;
    
    const totalCurrentLiabilities = reportData.currentLiabilities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    const totalLongTermLiabilities = reportData.longTermLiabilities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;
    
    const totalEquity = reportData.equity?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    // Create Balance Sheet worksheet
    const balanceSheet = workbook.addWorksheet('Balance Sheet');
    
    // Set column widths
    balanceSheet.columns = [
      { key: 'description', width: 40 },
      { key: 'amount', width: 20 }
    ];

    // Add header
    const headerRow = balanceSheet.addRow([reportData.businessName || 'Your Business']);
    headerRow.font = { size: 18, bold: true, color: { argb: 'FF1F2937' } };
    headerRow.alignment = { horizontal: 'center' };
    balanceSheet.mergeCells('A1:B1');

    const titleRow = balanceSheet.addRow(['BALANCE SHEET']);
    titleRow.font = { size: 16, bold: true, color: { argb: 'FF374151' } };
    titleRow.alignment = { horizontal: 'center' };
    balanceSheet.mergeCells('A2:B2');

    const dateRow = balanceSheet.addRow([`As of ${reportData.asOfDate || new Date().toLocaleDateString()}`]);
    dateRow.font = { size: 12, italic: true, color: { argb: 'FF6B7280' } };
    dateRow.alignment = { horizontal: 'center' };
    balanceSheet.mergeCells('A3:B3');

    // Add spacing
    balanceSheet.addRow([]);

    // Format currency function
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(amount);
    };

    // ASSETS Section
    const assetsHeaderRow = balanceSheet.addRow(['ASSETS', '']);
    assetsHeaderRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    assetsHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    assetsHeaderRow.alignment = { horizontal: 'center' };

    // Current Assets
    const currentAssetsRow = balanceSheet.addRow(['Current Assets', '']);
    currentAssetsRow.font = { size: 12, bold: true, color: { argb: 'FF374151' } };
    currentAssetsRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

    if (reportData.currentAssets && reportData.currentAssets.length > 0) {
      reportData.currentAssets.forEach(asset => {
        const row = balanceSheet.addRow([`  ${asset.name}`, formatCurrency(asset.amount || 0)]);
        row.getCell(2).alignment = { horizontal: 'right' };
        row.getCell(2).font = { family: 4 }; // Monospace font
      });
    } else {
      balanceSheet.addRow(['  No current assets data', '-']);
    }

    const totalCurrentAssetsRow = balanceSheet.addRow(['Total Current Assets', formatCurrency(totalCurrentAssets)]);
    totalCurrentAssetsRow.font = { bold: true };
    totalCurrentAssetsRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
    totalCurrentAssetsRow.getCell(2).alignment = { horizontal: 'right' };
    totalCurrentAssetsRow.getCell(2).font = { bold: true, family: 4 };

    // Fixed Assets
    const fixedAssetsRow = balanceSheet.addRow(['Fixed Assets', '']);
    fixedAssetsRow.font = { size: 12, bold: true, color: { argb: 'FF374151' } };
    fixedAssetsRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

    if (reportData.fixedAssets && reportData.fixedAssets.length > 0) {
      reportData.fixedAssets.forEach(asset => {
        const row = balanceSheet.addRow([`  ${asset.name}`, formatCurrency(asset.amount || 0)]);
        row.getCell(2).alignment = { horizontal: 'right' };
        row.getCell(2).font = { family: 4 };
      });
    } else {
      balanceSheet.addRow(['  No fixed assets data', '-']);
    }

    const totalFixedAssetsRow = balanceSheet.addRow(['Total Fixed Assets', formatCurrency(totalFixedAssets)]);
    totalFixedAssetsRow.font = { bold: true };
    totalFixedAssetsRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
    totalFixedAssetsRow.getCell(2).alignment = { horizontal: 'right' };
    totalFixedAssetsRow.getCell(2).font = { bold: true, family: 4 };

    // Total Assets
    const totalAssetsRow = balanceSheet.addRow(['TOTAL ASSETS', formatCurrency(totalAssets)]);
    totalAssetsRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    totalAssetsRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    totalAssetsRow.getCell(2).alignment = { horizontal: 'right' };
    totalAssetsRow.getCell(2).font = { size: 14, bold: true, family: 4, color: { argb: 'FFFFFFFF' } };

    // Add spacing
    balanceSheet.addRow([]);

    // LIABILITIES & EQUITY Section
    const liabilitiesHeaderRow = balanceSheet.addRow(['LIABILITIES & EQUITY', '']);
    liabilitiesHeaderRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    liabilitiesHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    liabilitiesHeaderRow.alignment = { horizontal: 'center' };

    // Current Liabilities
    const currentLiabilitiesRow = balanceSheet.addRow(['Current Liabilities', '']);
    currentLiabilitiesRow.font = { size: 12, bold: true, color: { argb: 'FF374151' } };
    currentLiabilitiesRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

    if (reportData.currentLiabilities && reportData.currentLiabilities.length > 0) {
      reportData.currentLiabilities.forEach(liability => {
        const row = balanceSheet.addRow([`  ${liability.name}`, formatCurrency(liability.amount || 0)]);
        row.getCell(2).alignment = { horizontal: 'right' };
        row.getCell(2).font = { family: 4 };
      });
    } else {
      balanceSheet.addRow(['  No current liabilities data', '-']);
    }

    const totalCurrentLiabilitiesRow = balanceSheet.addRow(['Total Current Liabilities', formatCurrency(totalCurrentLiabilities)]);
    totalCurrentLiabilitiesRow.font = { bold: true };
    totalCurrentLiabilitiesRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
    totalCurrentLiabilitiesRow.getCell(2).alignment = { horizontal: 'right' };
    totalCurrentLiabilitiesRow.getCell(2).font = { bold: true, family: 4 };

    // Long Term Liabilities
    const longTermLiabilitiesRow = balanceSheet.addRow(['Long Term Liabilities', '']);
    longTermLiabilitiesRow.font = { size: 12, bold: true, color: { argb: 'FF374151' } };
    longTermLiabilitiesRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

    if (reportData.longTermLiabilities && reportData.longTermLiabilities.length > 0) {
      reportData.longTermLiabilities.forEach(liability => {
        const row = balanceSheet.addRow([`  ${liability.name}`, formatCurrency(liability.amount || 0)]);
        row.getCell(2).alignment = { horizontal: 'right' };
        row.getCell(2).font = { family: 4 };
      });
    } else {
      balanceSheet.addRow(['  No long term liabilities data', '-']);
    }

    const totalLongTermLiabilitiesRow = balanceSheet.addRow(['Total Long Term Liabilities', formatCurrency(totalLongTermLiabilities)]);
    totalLongTermLiabilitiesRow.font = { bold: true };
    totalLongTermLiabilitiesRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
    totalLongTermLiabilitiesRow.getCell(2).alignment = { horizontal: 'right' };
    totalLongTermLiabilitiesRow.getCell(2).font = { bold: true, family: 4 };

    // Equity
    const equityRow = balanceSheet.addRow(['Equity', '']);
    equityRow.font = { size: 12, bold: true, color: { argb: 'FF374151' } };
    equityRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

    if (reportData.equity && reportData.equity.length > 0) {
      reportData.equity.forEach(equity => {
        const row = balanceSheet.addRow([`  ${equity.name}`, formatCurrency(equity.amount || 0)]);
        row.getCell(2).alignment = { horizontal: 'right' };
        row.getCell(2).font = { family: 4 };
      });
    } else {
      balanceSheet.addRow(['  No equity data', '-']);
    }

    const totalEquityRow = balanceSheet.addRow(['Total Equity', formatCurrency(totalEquity)]);
    totalEquityRow.font = { bold: true };
    totalEquityRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
    totalEquityRow.getCell(2).alignment = { horizontal: 'right' };
    totalEquityRow.getCell(2).font = { bold: true, family: 4 };

    // Total Liabilities & Equity
    const totalLiabilitiesEquityRow = balanceSheet.addRow(['TOTAL LIABILITIES & EQUITY', formatCurrency(totalLiabilitiesAndEquity)]);
    totalLiabilitiesEquityRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    totalLiabilitiesEquityRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    totalLiabilitiesEquityRow.getCell(2).alignment = { horizontal: 'right' };
    totalLiabilitiesEquityRow.getCell(2).font = { size: 14, bold: true, family: 4, color: { argb: 'FFFFFFFF' } };

    // Add balance check
    balanceSheet.addRow([]);
    const balanceCheckRow = balanceSheet.addRow(['Balance Check:', totalAssets === totalLiabilitiesAndEquity ? '✓ BALANCED' : '⚠ UNBALANCED']);
    balanceCheckRow.font = { bold: true, size: 12 };
    balanceCheckRow.fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: totalAssets === totalLiabilitiesAndEquity ? 'FF10B981' : 'FFEF4444' } 
    };
    balanceCheckRow.getCell(1).font.color = { argb: 'FFFFFFFF' };
    balanceCheckRow.getCell(2).font.color = { argb: 'FFFFFFFF' };

    // Add charts & analysis worksheet
    await addBalanceSheetChartsSheet(workbook, reportData, chartData, {
      totalAssets,
      totalCurrentAssets,
      totalFixedAssets,
      totalLiabilities,
      totalCurrentLiabilities,
      totalLongTermLiabilities,
      totalEquity,
      totalLiabilitiesAndEquity
    });

    return workbook;

  } catch (error) {
    console.error('Error generating balance sheet Excel:', error);
    throw error;
  }
}

async function addBalanceSheetChartsSheet(workbook, reportData, chartData, totals) {
  const chartSheet = workbook.addWorksheet('Charts & Analysis');
  
  // Set column widths
  chartSheet.columns = [
    { key: 'A', width: 25 },
    { key: 'B', width: 18 },
    { key: 'C', width: 5 },
    { key: 'D', width: 25 },
    { key: 'E', width: 18 }
  ];

  // Add title
  const titleRow = chartSheet.addRow(['BALANCE SHEET CHARTS & ANALYSIS']);
  titleRow.font = { size: 16, bold: true, color: { argb: 'FF1F2937' } };
  titleRow.alignment = { horizontal: 'center' };
  chartSheet.mergeCells('A1:E1');

  const subtitleRow = chartSheet.addRow(['Chart-ready data and instructions for creating professional financial charts']);
  subtitleRow.font = { size: 11, italic: true, color: { argb: 'FF6B7280' } };
  subtitleRow.alignment = { horizontal: 'center' };
  chartSheet.mergeCells('A2:E2');

  // Add spacing
  chartSheet.addRow([]);

  // Assets vs Liabilities Overview
  const overviewHeaderRow = chartSheet.addRow(['ASSETS vs LIABILITIES OVERVIEW']);
  overviewHeaderRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  overviewHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  chartSheet.mergeCells('A4:E4');

  chartSheet.addRow(['Category', 'Amount', '', 'Percentage', 'Notes']);
  const headerRow = chartSheet.getRow(5);
  headerRow.font = { bold: true, color: { argb: 'FF374151' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

  // Format currency for chart data
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalValue = totals.totalAssets;
  chartSheet.addRow([
    'Total Assets', 
    formatCurrency(totals.totalAssets),
    '',
    `${totalValue > 0 ? ((totals.totalAssets / totalValue) * 100).toFixed(1) : 0}%`,
    'Use for pie chart'
  ]);
  
  chartSheet.addRow([
    'Total Liabilities', 
    formatCurrency(totals.totalLiabilities),
    '',
    `${totalValue > 0 ? ((totals.totalLiabilities / totalValue) * 100).toFixed(1) : 0}%`,
    'Use for pie chart'
  ]);
  
  chartSheet.addRow([
    'Total Equity', 
    formatCurrency(totals.totalEquity),
    '',
    `${totalValue > 0 ? ((totals.totalEquity / totalValue) * 100).toFixed(1) : 0}%`,
    'Use for pie chart'
  ]);

  // Add spacing
  chartSheet.addRow([]);

  // Asset Breakdown
  const assetBreakdownRow = chartSheet.addRow(['ASSET BREAKDOWN']);
  assetBreakdownRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  assetBreakdownRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
  chartSheet.mergeCells('A10:E10');

  chartSheet.addRow(['Asset Category', 'Amount', '', 'Percentage', 'Chart Type']);
  const assetHeaderRow = chartSheet.getRow(11);
  assetHeaderRow.font = { bold: true, color: { argb: 'FF374151' } };
  assetHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };

  chartSheet.addRow([
    'Current Assets', 
    formatCurrency(totals.totalCurrentAssets),
    '',
    `${totals.totalAssets > 0 ? ((totals.totalCurrentAssets / totals.totalAssets) * 100).toFixed(1) : 0}%`,
    'Bar/Column Chart'
  ]);

  chartSheet.addRow([
    'Fixed Assets', 
    formatCurrency(totals.totalFixedAssets),
    '',
    `${totals.totalAssets > 0 ? ((totals.totalFixedAssets / totals.totalAssets) * 100).toFixed(1) : 0}%`,
    'Bar/Column Chart'
  ]);

  // Individual current assets
  if (reportData.currentAssets && reportData.currentAssets.length > 0) {
    reportData.currentAssets.forEach(asset => {
      chartSheet.addRow([
        `  ${asset.name}`, 
        formatCurrency(asset.amount || 0),
        '',
        `${totals.totalCurrentAssets > 0 ? (((asset.amount || 0) / totals.totalCurrentAssets) * 100).toFixed(1) : 0}%`,
        'Detailed breakdown'
      ]);
    });
  }

  // Individual fixed assets
  if (reportData.fixedAssets && reportData.fixedAssets.length > 0) {
    reportData.fixedAssets.forEach(asset => {
      chartSheet.addRow([
        `  ${asset.name}`, 
        formatCurrency(asset.amount || 0),
        '',
        `${totals.totalFixedAssets > 0 ? (((asset.amount || 0) / totals.totalFixedAssets) * 100).toFixed(1) : 0}%`,
        'Detailed breakdown'
      ]);
    });
  }

  // Add spacing
  chartSheet.addRow([]);

  // Liability & Equity Breakdown
  const liabilityBreakdownRow = chartSheet.addRow(['LIABILITY & EQUITY BREAKDOWN']);
  liabilityBreakdownRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  liabilityBreakdownRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC2626' } };
  chartSheet.mergeCells(`A${chartSheet.rowCount}:E${chartSheet.rowCount}`);

  chartSheet.addRow(['Category', 'Amount', '', 'Percentage', 'Chart Type']);
  const liabilityHeaderRow = chartSheet.getRow(chartSheet.rowCount);
  liabilityHeaderRow.font = { bold: true, color: { argb: 'FF374151' } };
  liabilityHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };

  chartSheet.addRow([
    'Current Liabilities', 
    formatCurrency(totals.totalCurrentLiabilities),
    '',
    `${totals.totalLiabilitiesAndEquity > 0 ? ((totals.totalCurrentLiabilities / totals.totalLiabilitiesAndEquity) * 100).toFixed(1) : 0}%`,
    'Bar/Column Chart'
  ]);

  chartSheet.addRow([
    'Long Term Liabilities', 
    formatCurrency(totals.totalLongTermLiabilities),
    '',
    `${totals.totalLiabilitiesAndEquity > 0 ? ((totals.totalLongTermLiabilities / totals.totalLiabilitiesAndEquity) * 100).toFixed(1) : 0}%`,
    'Bar/Column Chart'
  ]);

  chartSheet.addRow([
    'Total Equity', 
    formatCurrency(totals.totalEquity),
    '',
    `${totals.totalLiabilitiesAndEquity > 0 ? ((totals.totalEquity / totals.totalLiabilitiesAndEquity) * 100).toFixed(1) : 0}%`,
    'Bar/Column Chart'
  ]);

  // Individual current liabilities
  if (reportData.currentLiabilities && reportData.currentLiabilities.length > 0) {
    reportData.currentLiabilities.forEach(liability => {
      chartSheet.addRow([
        `  ${liability.name}`, 
        formatCurrency(liability.amount || 0),
        '',
        `${totals.totalCurrentLiabilities > 0 ? (((liability.amount || 0) / totals.totalCurrentLiabilities) * 100).toFixed(1) : 0}%`,
        'Detailed breakdown'
      ]);
    });
  }

  // Individual long term liabilities
  if (reportData.longTermLiabilities && reportData.longTermLiabilities.length > 0) {
    reportData.longTermLiabilities.forEach(liability => {
      chartSheet.addRow([
        `  ${liability.name}`, 
        formatCurrency(liability.amount || 0),
        '',
        `${totals.totalLongTermLiabilities > 0 ? (((liability.amount || 0) / totals.totalLongTermLiabilities) * 100).toFixed(1) : 0}%`,
        'Detailed breakdown'
      ]);
    });
  }

  // Individual equity items
  if (reportData.equity && reportData.equity.length > 0) {
    reportData.equity.forEach(equity => {
      chartSheet.addRow([
        `  ${equity.name}`, 
        formatCurrency(equity.amount || 0),
        '',
        `${totals.totalEquity > 0 ? (((equity.amount || 0) / totals.totalEquity) * 100).toFixed(1) : 0}%`,
        'Detailed breakdown'
      ]);
    });
  }

  // Add key financial ratios
  chartSheet.addRow([]);
  const ratiosHeaderRow = chartSheet.addRow(['KEY FINANCIAL RATIOS']);
  ratiosHeaderRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  ratiosHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7C3AED' } };
  chartSheet.mergeCells(`A${chartSheet.rowCount}:E${chartSheet.rowCount}`);

  chartSheet.addRow(['Ratio Name', 'Value', '', 'Interpretation', 'Benchmark']);
  const ratiosSubHeaderRow = chartSheet.getRow(chartSheet.rowCount);
  ratiosSubHeaderRow.font = { bold: true, color: { argb: 'FF374151' } };
  ratiosSubHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

  const currentRatio = totals.totalCurrentLiabilities > 0 ? (totals.totalCurrentAssets / totals.totalCurrentLiabilities).toFixed(2) : 'N/A';
  const debtToEquityRatio = totals.totalEquity > 0 ? (totals.totalLiabilities / totals.totalEquity).toFixed(2) : 'N/A';
  const equityRatio = totals.totalAssets > 0 ? ((totals.totalEquity / totals.totalAssets) * 100).toFixed(1) + '%' : 'N/A';

  chartSheet.addRow(['Current Ratio', currentRatio, '', 'Liquidity measure', '> 1.0 (Good)']);
  chartSheet.addRow(['Debt-to-Equity Ratio', debtToEquityRatio, '', 'Leverage measure', '< 1.0 (Conservative)']);
  chartSheet.addRow(['Equity Ratio', equityRatio, '', 'Ownership percentage', '> 50% (Healthy)']);

  // Add chart creation instructions
  chartSheet.addRow([]);
  chartSheet.addRow([]);
  const instructionsHeaderRow = chartSheet.addRow(['CHART CREATION INSTRUCTIONS']);
  instructionsHeaderRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  instructionsHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
  chartSheet.mergeCells(`A${chartSheet.rowCount}:E${chartSheet.rowCount}`);

  const instructions = [
    '1. PIE CHART - Assets vs Liabilities vs Equity:',
    '   • Select data from "Assets vs Liabilities Overview" section (rows 6-8)',
    '   • Insert → Charts → Pie Chart',
    '   • Title: "Financial Position Overview"',
    '',
    '2. COLUMN CHART - Asset Breakdown:',
    '   • Select Current Assets and Fixed Assets data (rows 12-13)',
    '   • Insert → Charts → Column Chart',
    '   • Title: "Asset Composition"',
    '',
    '3. STACKED BAR CHART - Liability & Equity Breakdown:',
    '   • Select liability and equity data (rows in Liability & Equity section)',
    '   • Insert → Charts → Stacked Bar Chart',
    '   • Title: "Capital Structure"',
    '',
    '4. FORMATTING TIPS:',
    '   • Use professional color scheme (Blue for assets, Red for liabilities, Green for equity)',
    '   • Add data labels showing percentages',
    '   • Include chart titles and axis labels',
    '   • Consider adding trend lines for time-series data',
    '',
    '5. FINANCIAL RATIOS CHART:',
    '   • Create a dashboard-style chart using the ratios data',
    '   • Use gauge charts or bullet charts for key performance indicators',
    '   • Color-code based on benchmark performance (Green=Good, Yellow=Caution, Red=Poor)'
  ];

  instructions.forEach(instruction => {
    const row = chartSheet.addRow([instruction]);
    if (instruction.startsWith('   •') || instruction.startsWith('   ')) {
      row.font = { size: 10, color: { argb: 'FF4B5563' } };
      row.getCell(1).alignment = { indent: 1 };
    } else if (instruction.match(/^\d+\./)) {
      row.font = { size: 11, bold: true, color: { argb: 'FF374151' } };
    } else {
      row.font = { size: 10, color: { argb: 'FF6B7280' } };
    }
    chartSheet.mergeCells(`A${chartSheet.rowCount}:E${chartSheet.rowCount}`);
  });

  // Apply borders and formatting to the entire sheet
  formatChartSheet(chartSheet);
}

function formatChartSheet(worksheet) {
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      // Add thin borders to all cells
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
      
      // Align currency values to the right
      if (colNumber === 2 && cell.value && typeof cell.value === 'string' && cell.value.includes('₹')) {
        cell.alignment = { horizontal: 'right' };
        cell.font = { family: 4 }; // Monospace font for currency
      }
      
      // Align percentages to the right
      if (colNumber === 4 && cell.value && typeof cell.value === 'string' && cell.value.includes('%')) {
        cell.alignment = { horizontal: 'right' };
      }
    });
  });
}

module.exports = { generateBalanceSheetExcel };
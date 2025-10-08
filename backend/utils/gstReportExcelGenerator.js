const ExcelJS = require('exceljs');

async function generateGSTReportExcel(reportData) {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Add GST Summary worksheet
    const worksheet = workbook.addWorksheet('GST Summary Report');
    
    // Set column widths
    worksheet.columns = [
      { header: 'Period', key: 'period', width: 20 },
      { header: 'Sales', key: 'sales', width: 15 },
      { header: 'GST Collected', key: 'gstCollected', width: 18 },
      { header: 'GST Paid', key: 'gstPaid', width: 15 },
      { header: 'Net GST', key: 'netGST', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Header styling
    const titleRow = worksheet.addRow(['GST Summary Report']);
    titleRow.font = { size: 16, bold: true, color: { argb: 'FF1e40af' } };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(1, 1, 1, 6);
    
    const subtitleRow = worksheet.addRow([`Generated on ${reportData.reportDate || new Date().toLocaleDateString('en-GB')}`]);
    subtitleRow.font = { size: 12, italic: true };
    subtitleRow.alignment = { horizontal: 'center' };
    worksheet.mergeCells(2, 1, 2, 6);
    
    worksheet.addRow([]); // Empty row
    
    // Header row
    const headerRow = worksheet.addRow(['Period', 'Sales', 'GST Collected', 'GST Paid', 'Net GST', 'Status']);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3b82f6' } };
    headerRow.alignment = { horizontal: 'center' };
    
    // Default data if not provided
    const defaultGSTData = [
      { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
      { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
      { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' },
      { period: 'September 2024', sales: 198000, gstCollected: 35640, gstPaid: 15800, netGST: 19840, status: 'Filed' },
      { period: 'August 2024', sales: 212000, gstCollected: 38160, gstPaid: 16200, netGST: 21960, status: 'Filed' }
    ];
    
    const gstData = reportData.gstSummary || defaultGSTData;
    
    // Add GST data rows
    let totalSales = 0;
    let totalGSTCollected = 0;
    let totalGSTPaid = 0;
    let totalNetGST = 0;
    
    gstData.forEach((item, index) => {
      const row = worksheet.addRow([
        item.period,
        item.sales,
        item.gstCollected,
        item.gstPaid,
        item.netGST,
        item.status
      ]);
      
      // Format currency columns
      row.getCell(2).numFmt = '₹#,##0.00';
      row.getCell(3).numFmt = '₹#,##0.00';
      row.getCell(4).numFmt = '₹#,##0.00';
      row.getCell(5).numFmt = '₹#,##0.00';
      
      // Status color coding
      if (item.status === 'Filed') {
        row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1fae5' } };
        row.getCell(6).font = { color: { argb: 'FF065f46' } };
      } else if (item.status === 'Pending') {
        row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };
        row.getCell(6).font = { color: { argb: 'FF92400e' } };
      } else if (item.status === 'Deposited') {
        row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdbeafe' } };
        row.getCell(6).font = { color: { argb: 'FF1e40af' } };
      }
      
      // Accumulate totals
      totalSales += item.sales || 0;
      totalGSTCollected += item.gstCollected || 0;
      totalGSTPaid += item.gstPaid || 0;
      totalNetGST += item.netGST || 0;
    });
    
    // Add total row
    const totalRow = worksheet.addRow(['TOTAL', totalSales, totalGSTCollected, totalGSTPaid, totalNetGST, '']);
    totalRow.font = { bold: true };
    totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf1f5f9' } };
    totalRow.getCell(2).numFmt = '₹#,##0.00';
    totalRow.getCell(3).numFmt = '₹#,##0.00';
    totalRow.getCell(4).numFmt = '₹#,##0.00';
    totalRow.getCell(5).numFmt = '₹#,##0.00';
    
    // TDS Summary Section
    worksheet.addRow([]); // Empty row
    worksheet.addRow([]); // Empty row
    
    const tdsHeaderRow = worksheet.addRow(['TDS Summary Report']);
    tdsHeaderRow.font = { size: 14, bold: true, color: { argb: 'FF1e40af' } };
    worksheet.mergeCells(tdsHeaderRow.number, 1, tdsHeaderRow.number, 6);
    
    // TDS Headers
    const tdsTableHeader = worksheet.addRow(['Quarter', 'Total Payments', 'TDS Deducted', 'TDS Deposited', 'Due Date', 'Status']);
    tdsTableHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    tdsTableHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3b82f6' } };
    
    // Default TDS data
    const defaultTDSData = [
      { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
      { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
      { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
    ];
    
    const tdsData = reportData.tdsSummary || defaultTDSData;
    
    // Add TDS data rows
    tdsData.forEach(item => {
      const row = worksheet.addRow([
        item.quarter,
        item.totalPayments,
        item.tdsDeducted,
        item.tdsDeposited,
        item.dueDate,
        item.status
      ]);
      
      // Format currency columns
      row.getCell(2).numFmt = '₹#,##0.00';
      row.getCell(3).numFmt = '₹#,##0.00';
      row.getCell(4).numFmt = '₹#,##0.00';
      
      // Status color coding
      if (item.status === 'Filed') {
        row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFd1fae5' } };
        row.getCell(6).font = { color: { argb: 'FF065f46' } };
      } else if (item.status === 'Deposited') {
        row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdbeafe' } };
        row.getCell(6).font = { color: { argb: 'FF1e40af' } };
      }
    });
    
    // Add borders to all cells with data
    const maxRow = worksheet.rowCount;
    const maxCol = 6;
    
    for (let row = 1; row <= maxRow; row++) {
      for (let col = 1; col <= maxCol; col++) {
        const cell = worksheet.getCell(row, col);
        if (row >= 4) { // Start from header row
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFe2e8f0' } },
            left: { style: 'thin', color: { argb: 'FFe2e8f0' } },
            bottom: { style: 'thin', color: { argb: 'FFe2e8f0' } },
            right: { style: 'thin', color: { argb: 'FFe2e8f0' } }
          };
        }
      }
    }
    
    // Add Chart Analysis worksheet
    await addGSTChartsSheet(workbook, reportData);
    
    const buffer = await workbook.xlsx.writeBuffer();
    console.log('✅ GST Report Excel generated successfully, size:', buffer.length, 'bytes');
    return buffer;

  } catch (error) {
    console.error('❌ GST Report Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

async function addGSTChartsSheet(workbook, reportData) {
  const chartSheet = workbook.addWorksheet('Chart Analysis & Summary');
  
  // Title
  const titleRow = chartSheet.addRow(['GST & TDS Report Analysis']);
  titleRow.font = { size: 18, bold: true, color: { argb: 'FF1e40af' } };
  titleRow.alignment = { horizontal: 'center' };
  chartSheet.mergeCells(1, 1, 1, 8);
  
  chartSheet.addRow([]); // Empty row
  
  // Analysis Section
  const analysisTitle = chartSheet.addRow(['Financial Analysis & Key Metrics']);
  analysisTitle.font = { size: 14, bold: true, color: { argb: 'FF374151' } };
  analysisTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8fafc' } };
  chartSheet.mergeCells(3, 1, 3, 8);
  
  chartSheet.addRow([]); // Empty row
  
  // Key Metrics
  const defaultGSTData = [
    { period: 'December 2024', sales: 287000, gstCollected: 51660, gstPaid: 22500, netGST: 29160, status: 'Pending' },
    { period: 'November 2024', sales: 235000, gstCollected: 42300, gstPaid: 17640, netGST: 24660, status: 'Filed' },
    { period: 'October 2024', sales: 220000, gstCollected: 39600, gstPaid: 18900, netGST: 20700, status: 'Filed' },
    { period: 'September 2024', sales: 198000, gstCollected: 35640, gstPaid: 15800, netGST: 19840, status: 'Filed' },
    { period: 'August 2024', sales: 212000, gstCollected: 38160, gstPaid: 16200, netGST: 21960, status: 'Filed' }
  ];
  
  const gstData = reportData.gstSummary || defaultGSTData;
  
  // Calculate metrics
  const totalSales = gstData.reduce((sum, item) => sum + (item.sales || 0), 0);
  const totalGSTCollected = gstData.reduce((sum, item) => sum + (item.gstCollected || 0), 0);
  const totalGSTPaid = gstData.reduce((sum, item) => sum + (item.gstPaid || 0), 0);
  const totalNetGST = gstData.reduce((sum, item) => sum + (item.netGST || 0), 0);
  const avgMonthlyGST = totalNetGST / gstData.length;
  const effectiveGSTRate = (totalGSTCollected / totalSales) * 100;
  
  // Add metrics table
  chartSheet.addRow(['Metric', 'Value', 'Analysis', '', '', '', '', '']);
  
  const metricsHeader = chartSheet.getRow(5);
  metricsHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  metricsHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3b82f6' } };
  
  const metrics = [
    ['Total Sales', `₹${totalSales.toLocaleString('en-IN')}`, 'Strong revenue performance across periods'],
    ['Total GST Collected', `₹${totalGSTCollected.toLocaleString('en-IN')}`, 'Consistent GST collection from sales'],
    ['Total GST Paid', `₹${totalGSTPaid.toLocaleString('en-IN')}`, 'Input tax credit utilized effectively'],
    ['Net GST Liability', `₹${totalNetGST.toLocaleString('en-IN')}`, 'Final GST payable to government'],
    ['Effective GST Rate', `${effectiveGSTRate.toFixed(2)}%`, 'Average GST rate on total sales'],
    ['Average Monthly GST', `₹${avgMonthlyGST.toLocaleString('en-IN')}`, 'Regular monthly GST obligation']
  ];
  
  metrics.forEach((metric, index) => {
    const row = chartSheet.addRow(metric);
    if (index % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8fafc' } };
    }
  });
  
  chartSheet.addRow([]); // Empty row
  chartSheet.addRow([]); // Empty row
  
  // Chart Data for visualization
  const chartDataTitle = chartSheet.addRow(['Chart Data for Visualization']);
  chartDataTitle.font = { size: 14, bold: true, color: { argb: 'FF374151' } };
  chartDataTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8fafc' } };
  chartSheet.mergeCells(13, 1, 13, 8);
  
  chartSheet.addRow([]); // Empty row
  
  // Monthly GST Trend Data
  chartSheet.addRow(['Period', 'Sales', 'GST Collected', 'GST Paid', 'Net GST', '', '', '']);
  const chartHeader = chartSheet.getRow(15);
  chartHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  chartHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10b981' } };
  
  gstData.forEach(item => {
    chartSheet.addRow([
      item.period,
      item.sales,
      item.gstCollected,
      item.gstPaid,
      item.netGST,
      '', '', ''
    ]);
  });
  
  // TDS Analysis
  chartSheet.addRow([]); // Empty row
  chartSheet.addRow([]); // Empty row
  
  const tdsTitle = chartSheet.addRow(['TDS Analysis & Compliance Summary']);
  tdsTitle.font = { size: 14, bold: true, color: { argb: 'FF374151' } };
  tdsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf8fafc' } };
  chartSheet.mergeCells(tdsTitle.number, 1, tdsTitle.number, 8);
  
  chartSheet.addRow([]); // Empty row
  
  // TDS Compliance Status
  const defaultTDSData = [
    { quarter: 'Q3 2024', totalPayments: 450000, tdsDeducted: 22500, tdsDeposited: 22500, dueDate: '2025-01-07', status: 'Deposited' },
    { quarter: 'Q2 2024', totalPayments: 380000, tdsDeducted: 19000, tdsDeposited: 19000, dueDate: '2024-10-07', status: 'Filed' },
    { quarter: 'Q1 2024', totalPayments: 320000, tdsDeducted: 16000, tdsDeposited: 16000, dueDate: '2024-07-07', status: 'Filed' }
  ];
  
  const tdsData = reportData.tdsSummary || defaultTDSData;
  
  chartSheet.addRow(['Quarter', 'Total Payments', 'TDS Deducted', 'TDS Rate %', 'Compliance Status', '', '', '']);
  const tdsChartHeader = chartSheet.getRow(chartSheet.rowCount);
  tdsChartHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  tdsChartHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf59e0b' } };
  
  tdsData.forEach(item => {
    const tdsRate = ((item.tdsDeducted / item.totalPayments) * 100).toFixed(2);
    chartSheet.addRow([
      item.quarter,
      item.totalPayments,
      item.tdsDeducted,
      `${tdsRate}%`,
      item.status,
      '', '', ''
    ]);
  });
  
  // Set column widths for chart sheet
  chartSheet.columns = [
    { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 },
    { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }
  ];
  
  // Add instructions for chart creation
  chartSheet.addRow([]); // Empty row
  chartSheet.addRow([]); // Empty row
  
  const instructionsTitle = chartSheet.addRow(['Instructions for Chart Creation']);
  instructionsTitle.font = { size: 14, bold: true, color: { argb: 'FF7c2d12' } };
  instructionsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef2f2' } };
  chartSheet.mergeCells(instructionsTitle.number, 1, instructionsTitle.number, 8);
  
  const instructions = [
    '1. Select data range A15:E' + (15 + gstData.length) + ' to create GST Trend Chart',
    '2. Insert Column Chart for monthly GST comparison visualization',
    '3. Create Pie Chart using Net GST values to show contribution by period',
    '4. Use TDS data for quarterly compliance tracking chart',
    '5. Recommended chart types: Line chart for trends, Bar chart for comparisons'
  ];
  
  instructions.forEach(instruction => {
    const row = chartSheet.addRow([instruction, '', '', '', '', '', '', '']);
    row.font = { size: 11 };
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfefefe' } };
  });
}

module.exports = { generateGSTReportExcel };
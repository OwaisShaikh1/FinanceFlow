const ExcelJS = require('exceljs');

async function generateCashFlowExcel(reportData) {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'TaxPro';
    workbook.lastModifiedBy = 'TaxPro';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Calculate totals
    const totalOperatingActivities = (reportData.operatingActivities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
    const totalInvestingActivities = (reportData.investingActivities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
    const totalFinancingActivities = (reportData.financingActivities?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0);
    const netIncreaseInCash = totalOperatingActivities + totalInvestingActivities + totalFinancingActivities;

    // Create main Cash Flow Statement worksheet
    const worksheet = workbook.addWorksheet('Cash Flow Statement');
    
    // Set column widths
    worksheet.columns = [
      { header: 'Activity', key: 'activity', width: 40 },
      { header: 'Amount', key: 'amount', width: 20 }
    ];

    // Add header section
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = 'TaxPro';
    worksheet.getCell('A1').font = { bold: true, size: 14, color: { argb: '1e40af' } };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:B2');
    worksheet.getCell('A2').value = reportData.businessName || 'Your Business';
    worksheet.getCell('A2').font = { bold: true, size: 18, color: { argb: '1e40af' } };
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A3:B3');
    worksheet.getCell('A3').value = 'Cash Flow Statement';
    worksheet.getCell('A3').font = { bold: true, size: 16 };
    worksheet.getCell('A3').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = `For the period ending ${reportData.periodEnding || new Date().toLocaleDateString('en-GB')}`;
    worksheet.getCell('A4').font = { size: 12 };
    worksheet.getCell('A4').alignment = { horizontal: 'center' };

    let currentRow = 6;

    // Add Operating Activities section
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'CASH FLOW FROM OPERATING ACTIVITIES';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3b82f6' }
    };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
    currentRow++;

    // Add operating activities data
    if (reportData.operatingActivities && reportData.operatingActivities.length > 0) {
      reportData.operatingActivities.forEach(item => {
        worksheet.getCell(`A${currentRow}`).value = item.name || 'Unknown Activity';
        worksheet.getCell(`B${currentRow}`).value = item.amount || 0;
        worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
        if ((item.amount || 0) < 0) {
          worksheet.getCell(`B${currentRow}`).font = { color: { argb: 'dc2626' } };
        } else {
          worksheet.getCell(`B${currentRow}`).font = { color: { argb: '059669' } };
        }
        currentRow++;
      });
    }

    // Add operating total
    worksheet.getCell(`A${currentRow}`).value = 'Net Cash from Operating Activities';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = totalOperatingActivities;
    worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
    currentRow += 2;

    // Add Investing Activities section
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'CASH FLOW FROM INVESTING ACTIVITIES';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3b82f6' }
    };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
    currentRow++;

    // Add investing activities data
    if (reportData.investingActivities && reportData.investingActivities.length > 0) {
      reportData.investingActivities.forEach(item => {
        worksheet.getCell(`A${currentRow}`).value = item.name || 'Unknown Activity';
        worksheet.getCell(`B${currentRow}`).value = item.amount || 0;
        worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
        if ((item.amount || 0) < 0) {
          worksheet.getCell(`B${currentRow}`).font = { color: { argb: 'dc2626' } };
        } else {
          worksheet.getCell(`B${currentRow}`).font = { color: { argb: '059669' } };
        }
        currentRow++;
      });
    }

    // Add investing total
    worksheet.getCell(`A${currentRow}`).value = 'Net Cash from Investing Activities';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = totalInvestingActivities;
    worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
    currentRow += 2;

    // Add Financing Activities section
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'CASH FLOW FROM FINANCING ACTIVITIES';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '3b82f6' }
    };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };
    currentRow++;

    // Add financing activities data
    if (reportData.financingActivities && reportData.financingActivities.length > 0) {
      reportData.financingActivities.forEach(item => {
        worksheet.getCell(`A${currentRow}`).value = item.name || 'Unknown Activity';
        worksheet.getCell(`B${currentRow}`).value = item.amount || 0;
        worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
        if ((item.amount || 0) < 0) {
          worksheet.getCell(`B${currentRow}`).font = { color: { argb: 'dc2626' } };
        } else {
          worksheet.getCell(`B${currentRow}`).font = { color: { argb: '059669' } };
        }
        currentRow++;
      });
    }

    // Add financing total
    worksheet.getCell(`A${currentRow}`).value = 'Net Cash from Financing Activities';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = totalFinancingActivities;
    worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
    currentRow += 2;

    // Add Net Increase in Cash
    worksheet.getCell(`A${currentRow}`).value = 'NET INCREASE IN CASH';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
    worksheet.getCell(`B${currentRow}`).value = netIncreaseInCash;
    worksheet.getCell(`B${currentRow}`).numFmt = '₹#,##0.00';
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
    worksheet.getCell(`A${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '059669' }
    };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '059669' }
    };

    // Add borders to all cells
    for (let i = 1; i <= currentRow; i++) {
      ['A', 'B'].forEach(col => {
        const cell = worksheet.getCell(`${col}${i}`);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    // Add Charts and Analysis worksheet
    await addCashFlowChartsSheet(workbook, reportData, {
      totalOperatingActivities,
      totalInvestingActivities,
      totalFinancingActivities,
      netIncreaseInCash
    });

    const buffer = await workbook.xlsx.writeBuffer();
    console.log('✅ Cash Flow Excel generated successfully, size:', buffer.length, 'bytes');
    return buffer;

  } catch (error) {
    console.error('❌ Cash Flow Excel generation error:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
}

async function addCashFlowChartsSheet(workbook, reportData, totals) {
  const chartSheet = workbook.addWorksheet('Cash Flow Analysis');
  
  // Set column widths
  chartSheet.columns = [
    { header: 'Category', key: 'category', width: 30 },
    { header: 'Amount', key: 'amount', width: 20 },
    { header: 'Percentage', key: 'percentage', width: 15 },
    { header: 'Analysis', key: 'analysis', width: 40 }
  ];

  // Add header
  chartSheet.mergeCells('A1:D1');
  chartSheet.getCell('A1').value = 'TaxPro - Cash Flow Analysis & Chart Data';
  chartSheet.getCell('A1').font = { bold: true, size: 16, color: { argb: '1e40af' } };
  chartSheet.getCell('A1').alignment = { horizontal: 'center' };

  chartSheet.mergeCells('A2:D2');
  chartSheet.getCell('A2').value = `Business: ${reportData.businessName || 'Your Business'}`;
  chartSheet.getCell('A2').font = { bold: true, size: 14 };
  chartSheet.getCell('A2').alignment = { horizontal: 'center' };

  // Add summary data for charts
  let row = 4;
  chartSheet.getCell(`A${row}`).value = 'CASH FLOW SUMMARY';
  chartSheet.getCell(`A${row}`).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
  chartSheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '3b82f6' }
  };
  chartSheet.mergeCells(`A${row}:D${row}`);
  row++;

  // Header row for data
  chartSheet.getCell(`A${row}`).value = 'Activity Category';
  chartSheet.getCell(`B${row}`).value = 'Net Cash Flow';
  chartSheet.getCell(`C${row}`).value = '% of Total';
  chartSheet.getCell(`D${row}`).value = 'Impact Analysis';
  
  ['A', 'B', 'C', 'D'].forEach(col => {
    chartSheet.getCell(`${col}${row}`).font = { bold: true };
    chartSheet.getCell(`${col}${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f1f5f9' }
    };
  });
  row++;

  // Calculate total absolute cash flow for percentages
  const totalAbsoluteCashFlow = Math.abs(totals.totalOperatingActivities) + 
                               Math.abs(totals.totalInvestingActivities) + 
                               Math.abs(totals.totalFinancingActivities);

  // Add operating activities data
  chartSheet.getCell(`A${row}`).value = 'Operating Activities';
  chartSheet.getCell(`B${row}`).value = totals.totalOperatingActivities;
  chartSheet.getCell(`B${row}`).numFmt = '₹#,##0.00';
  const operatingPercentage = totalAbsoluteCashFlow > 0 ? (Math.abs(totals.totalOperatingActivities) / totalAbsoluteCashFlow * 100) : 0;
  chartSheet.getCell(`C${row}`).value = operatingPercentage / 100;
  chartSheet.getCell(`C${row}`).numFmt = '0.0%';
  chartSheet.getCell(`D${row}`).value = totals.totalOperatingActivities >= 0 ? 'Positive cash generation from core business operations' : 'Cash used in core business operations';
  if (totals.totalOperatingActivities >= 0) {
    chartSheet.getCell(`B${row}`).font = { color: { argb: '059669' } };
  } else {
    chartSheet.getCell(`B${row}`).font = { color: { argb: 'dc2626' } };
  }
  row++;

  // Add investing activities data
  chartSheet.getCell(`A${row}`).value = 'Investing Activities';
  chartSheet.getCell(`B${row}`).value = totals.totalInvestingActivities;
  chartSheet.getCell(`B${row}`).numFmt = '₹#,##0.00';
  const investingPercentage = totalAbsoluteCashFlow > 0 ? (Math.abs(totals.totalInvestingActivities) / totalAbsoluteCashFlow * 100) : 0;
  chartSheet.getCell(`C${row}`).value = investingPercentage / 100;
  chartSheet.getCell(`C${row}`).numFmt = '0.0%';
  chartSheet.getCell(`D${row}`).value = totals.totalInvestingActivities >= 0 ? 'Cash inflow from investments and asset sales' : 'Cash invested in assets and investments';
  if (totals.totalInvestingActivities >= 0) {
    chartSheet.getCell(`B${row}`).font = { color: { argb: '059669' } };
  } else {
    chartSheet.getCell(`B${row}`).font = { color: { argb: 'dc2626' } };
  }
  row++;

  // Add financing activities data
  chartSheet.getCell(`A${row}`).value = 'Financing Activities';
  chartSheet.getCell(`B${row}`).value = totals.totalFinancingActivities;
  chartSheet.getCell(`B${row}`).numFmt = '₹#,##0.00';
  const financingPercentage = totalAbsoluteCashFlow > 0 ? (Math.abs(totals.totalFinancingActivities) / totalAbsoluteCashFlow * 100) : 0;
  chartSheet.getCell(`C${row}`).value = financingPercentage / 100;
  chartSheet.getCell(`C${row}`).numFmt = '0.0%';
  chartSheet.getCell(`D${row}`).value = totals.totalFinancingActivities >= 0 ? 'Cash raised through financing' : 'Cash used for debt payments and dividends';
  if (totals.totalFinancingActivities >= 0) {
    chartSheet.getCell(`B${row}`).font = { color: { argb: '059669' } };
  } else {
    chartSheet.getCell(`B${row}`).font = { color: { argb: 'dc2626' } };
  }
  row += 2;

  // Add net cash flow
  chartSheet.getCell(`A${row}`).value = 'NET INCREASE IN CASH';
  chartSheet.getCell(`B${row}`).value = totals.netIncreaseInCash;
  chartSheet.getCell(`B${row}`).numFmt = '₹#,##0.00';
  chartSheet.getCell(`C${row}`).value = '100%';
  chartSheet.getCell(`D${row}`).value = totals.netIncreaseInCash >= 0 ? 'Overall cash position improved' : 'Overall cash position decreased';
  
  ['A', 'B', 'C', 'D'].forEach(col => {
    chartSheet.getCell(`${col}${row}`).font = { bold: true, color: { argb: 'FFFFFF' } };
    chartSheet.getCell(`${col}${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: totals.netIncreaseInCash >= 0 ? '059669' : 'dc2626' }
    };
  });
  row += 3;

  // Add chart instructions
  chartSheet.getCell(`A${row}`).value = 'CHART CREATION INSTRUCTIONS';
  chartSheet.getCell(`A${row}`).font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
  chartSheet.getCell(`A${row}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '059669' }
  };
  chartSheet.mergeCells(`A${row}:D${row}`);
  row++;

  const instructions = [
    '1. Select the data range A6:C8 (Activity categories and amounts)',
    '2. Insert → Charts → Pie Chart or Column Chart',
    '3. Add chart title: "Cash Flow Analysis by Activity"',
    '4. Format positive values in green, negative in red',
    '5. Add data labels showing percentages',
    '6. Consider creating a waterfall chart to show cash flow progression'
  ];

  instructions.forEach(instruction => {
    chartSheet.getCell(`A${row}`).value = instruction;
    chartSheet.mergeCells(`A${row}:D${row}`);
    row++;
  });

  // Add borders to all used cells
  for (let i = 1; i <= row; i++) {
    ['A', 'B', 'C', 'D'].forEach(col => {
      const cell = chartSheet.getCell(`${col}${i}`);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }
}

module.exports = { generateCashFlowExcel };
"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share, Printer as Print } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"

interface ReportHeaderProps {
  title: string
  description: string
  reportType: string
  reportData?: any
}

export function ReportHeader({ title, description, reportType, reportData }: ReportHeaderProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  // Function to extract chart data from the current page
  const extractChartData = () => {
    console.log('ReportData received:', reportData)
    
    // Create optimized data object without large arrays
    const chartData: any = {
      extractedAt: new Date().toISOString(),
      pageTitle: title,
      reportType: reportType,
      businessName: reportData?.businessName || 'Your Business'
    }
    
    // Only include summary data, not full transaction arrays
    if (reportData?.transactions && Array.isArray(reportData.transactions)) {
      const transactions = reportData.transactions;
      
      // Process summary statistics instead of sending full data
      const summary = {
        totalTransactions: transactions.length,
        totalIncome: transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
        totalExpenses: transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + Math.abs(t.amount || 0), 0),
        dateRange: {
          start: transactions.length > 0 ? Math.min(...transactions.map((t: any) => new Date(t.date).getTime())) : null,
          end: transactions.length > 0 ? Math.max(...transactions.map((t: any) => new Date(t.date).getTime())) : null
        }
      };
      
      chartData.summary = summary;
    }
    
    console.log('Optimized chartData:', chartData)

    try {
      // Try to extract data from common chart containers
      const chartElements = document.querySelectorAll('[data-chart], .recharts-wrapper, .chart-container')
      
      chartElements.forEach((element, index) => {
        const chartType = element.getAttribute('data-chart-type') || `chart-${index + 1}`
        const chartTitle = element.getAttribute('data-chart-title') || element.querySelector('h3, h4, .chart-title')?.textContent || `Chart ${index + 1}`
        
        // Try to extract data from data attributes or text content
        const dataAttribute = element.getAttribute('data-chart-data')
        if (dataAttribute) {
          try {
            chartData[`${chartType}_data`] = JSON.parse(dataAttribute)
            chartData[`${chartType}_title`] = chartTitle
          } catch (e) {
            console.warn('Failed to parse chart data:', e)
          }
        }
      })

      // Extract table data that might represent chart data
      const tables = document.querySelectorAll('table[data-export], .data-table')
      tables.forEach((table, index) => {
        const tableData = extractTableData(table as HTMLTableElement)
        if (tableData.length > 0) {
          chartData[`table_${index + 1}_data`] = tableData
        }
      })

    } catch (error) {
      console.warn('Error extracting chart data:', error)
    }

    return chartData
  }

  // Helper function to extract data from HTML tables
  const extractTableData = (table: HTMLTableElement) => {
    const data: any[] = []
    const rows = table.querySelectorAll('tr')
    
    if (rows.length === 0) return data
    
    // Get headers
    const headers = Array.from(rows[0].querySelectorAll('th, td')).map(cell => 
      cell.textContent?.trim() || ''
    )
    
    // Get data rows
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td, th'))
      if (cells.length === headers.length) {
        const rowData: any = {}
        headers.forEach((header, index) => {
          if (header) {
            rowData[header] = cells[index]?.textContent?.trim() || ''
          }
        })
        data.push(rowData)
      }
    }
    
    return data
  }

  const handleExportAction = async (action: 'print' | 'share' | 'export-pdf' | 'export-excel') => {
    setIsLoading(action)
    
    try {
      switch (action) {
        case 'print':
          // Generate Tax Pro branded PDF for Profit & Loss
          if (reportType === 'profit-loss') {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/api/reports/profit-loss/pdf?businessName=${encodeURIComponent(reportData?.businessName || 'Your Business')}&period=${encodeURIComponent(description)}`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                }
              });

              if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `profit-loss-statement-${new Date().getTime()}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                toast({
                  title: "PDF Generated",
                  description: "Tax Pro Profit & Loss Statement downloaded successfully"
                });
              } else {
                throw new Error('Failed to generate PDF');
              }
            } catch (error) {
              console.error('PDF generation failed:', error);
              toast({
                title: "PDF Generation Failed",
                description: "Using browser print as fallback"
              });
              // Fallback to browser print
              window.print();
            }
          }
          // Generate Tax Pro branded PDF for Balance Sheet
          else if (reportType === 'balance-sheet') {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/api/reports/balance-sheet/pdf?businessName=${encodeURIComponent(reportData?.businessName || 'Your Business')}&asOfDate=${encodeURIComponent(new Date().toLocaleDateString('en-GB'))}`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                }
              });

              if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `balance-sheet-${new Date().getTime()}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                toast({
                  title: "PDF Generated",
                  description: "Tax Pro Balance Sheet downloaded successfully"
                });
              } else {
                throw new Error('Failed to generate PDF');
              }
            } catch (error) {
              console.error('Balance Sheet PDF generation failed:', error);
              toast({
                title: "PDF Generation Failed",
                description: "Using browser print as fallback"
              });
              // Fallback to browser print
              window.print();
            }
          }
          else {
            // Default browser print for other report types
            window.print();
            toast({
              title: "Print Ready",
              description: "Print dialog opened"
            });
          }
          break;

        case 'share':
          // Use Web Share API if available, otherwise fallback to clipboard
          if (navigator.share) {
            await navigator.share({
              title: title,
              text: description,
              url: window.location.href
            })
            toast({
              title: "Shared Successfully",
              description: "Report shared via device sharing"
            })
          } else {
            // Fallback: copy URL to clipboard
            await navigator.clipboard.writeText(window.location.href)
            toast({
              title: "Link Copied",
              description: "Report URL copied to clipboard"
            })
          }
          break

        case 'export-excel':
          // Generate Excel using backend API
          let excelResponse;
          
          if (reportType === 'balance-sheet') {
            // Use dedicated balance sheet Excel endpoint
            const token = localStorage.getItem("token");
            excelResponse = await fetch(`${API_BASE_URL}/api/reports/balance-sheet/excel?businessName=${encodeURIComponent(reportData?.businessName || 'Your Business')}&asOfDate=${encodeURIComponent(new Date().toLocaleDateString('en-GB'))}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              }
            });
          } else {
            // Use generic export endpoint for other report types
            excelResponse = await fetch(`${API_BASE_URL}/api/export`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                action: 'excel',
                reportType,
                data: extractChartData(), // Send enhanced data with chart information
                url: window.location.href
              })
            });
          }

          if (!excelResponse.ok) {
            let errorMessage = 'Excel export failed'
            try {
              const errorResult = await excelResponse.json()
              errorMessage = errorResult.error || errorMessage
              console.log('Server error details:', errorResult)
            } catch (e) {
              // If response is not JSON, use status text
              errorMessage = `Server error: ${excelResponse.status} ${excelResponse.statusText}`
            }
            console.log('Full error:', errorMessage)
            throw new Error(errorMessage)
          }

          // Download the Excel file
          const excelBlob = await excelResponse.blob()
          const excelUrl = window.URL.createObjectURL(excelBlob)
          const excelLink = document.createElement('a')
          excelLink.style.display = 'none'
          excelLink.href = excelUrl
          excelLink.download = reportType === 'balance-sheet' 
            ? `balance-sheet-${new Date().getTime()}.xlsx`
            : `${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`
          document.body.appendChild(excelLink)
          excelLink.click()
          window.URL.revokeObjectURL(excelUrl)
          document.body.removeChild(excelLink)

          toast({
            title: "Excel Downloaded",
            description: reportType === 'balance-sheet' 
              ? "Balance Sheet with charts downloaded successfully"
              : "Report saved as Excel file"
          })
          break

        case 'export-pdf':
          // Generate PDF for non-P&L reports using browser print
          window.print()
          toast({
            title: "PDF Generation",
            description: "Print dialog opened for PDF generation"
          })
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex gap-2 no-print print-hide">
        <Button 
          variant="outline" 
          onClick={() => handleExportAction('print')}
          disabled={isLoading === 'print'}
        >
          <Print className="h-4 w-4 mr-2" />
          {isLoading === 'print' ? 'Printing...' : 'Print'}
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleExportAction('share')}
          disabled={isLoading === 'share'}
        >
          <Share className="h-4 w-4 mr-2" />
          {isLoading === 'share' ? 'Sharing...' : 'Share'}
        </Button>
        <Button
          onClick={() => handleExportAction('export-excel')}
          disabled={isLoading === 'export-excel'}
        >
          <Download className="h-4 w-4 mr-2" />
          {isLoading === 'export-excel' ? 'Exporting...' : 'Export Excel'}
        </Button>
      </div>
    </div>
  )
}

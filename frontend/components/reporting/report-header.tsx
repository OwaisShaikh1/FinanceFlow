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
    const chartData: any = {
      ...reportData,
      extractedAt: new Date().toISOString(),
      pageTitle: title,
      reportType: reportType
    }
    console.log('Final chartData:', chartData)

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

  const handleExportAction = async (action: 'print' | 'share' | 'export-pdf') => {
    setIsLoading(action)
    
    try {
      switch (action) {
        case 'print':
          // Open browser print dialog for current page
          window.print()
          toast({
            title: "Print Ready",
            description: "Print dialog opened"
          })
          break

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

        case 'export-pdf':
          // Generate Excel using backend API

          const response = await fetch(`${API_BASE_URL}/api/export`, {
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
          })

          if (!response.ok) {
            let errorMessage = 'Excel export failed'
            try {
              const errorResult = await response.json()
              errorMessage = errorResult.error || errorMessage
              console.log('Server error details:', errorResult)
            } catch (e) {
              // If response is not JSON, use status text
              errorMessage = `Server error: ${response.status} ${response.statusText}`
            }
            console.log('Full error:', errorMessage)
            throw new Error(errorMessage)
          }

          // Download the Excel file
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.style.display = 'none'
          a.href = url
          a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)

          toast({
            title: "Excel Downloaded",
            description: "Report saved as Excel file"
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
          onClick={() => handleExportAction('export-pdf')}
          disabled={isLoading === 'export-pdf'}
        >
          <Download className="h-4 w-4 mr-2" />
          {isLoading === 'export-pdf' ? 'Exporting...' : 'Export Excel'}
        </Button>
      </div>
    </div>
  )
}

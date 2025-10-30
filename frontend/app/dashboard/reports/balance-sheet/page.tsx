"use client"

import { BalanceSheetReport } from "@/components/reporting/balance-sheet-report"
import { BalanceSheetChart } from "@/components/reporting/balance-sheet-chart"
import { ReportHeader } from "@/components/reporting/report-header"
import { useState, useEffect } from "react"
import { ENDPOINTS } from "@/lib/config"
import { useClientContext } from "@/contexts/ClientContext"

interface BalanceSheetItem {
  _id: string;
  name: string;
  amount: number;
  type: 'current-asset' | 'fixed-asset' | 'current-liability' | 'long-term-liability' | 'equity';
  category?: string;
}

interface BalanceSheetData {
  currentAssets: Array<{ name: string; value: number }>;
  fixedAssets: Array<{ name: string; value: number }>;
  totalAssets: number;
  currentLiabilities: Array<{ name: string; value: number }>;
  longTermLiabilities: Array<{ name: string; value: number }>;
  totalLiabilities: number;
  equity: Array<{ name: string; value: number }>;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  asOfDate?: Date;
}

export default function BalanceSheetPage() {
  const [balanceSheetItems, setBalanceSheetItems] = useState<BalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedClient } = useClientContext();

  // Fetch real balance sheet data from API
  const fetchBalanceSheetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { 
        "Content-Type": "application/json" 
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Get current date as default "as of" date
      const asOfDate = new Date().toISOString();
      
      // Add client filtering if a client is selected
      const queryParams = selectedClient?.id 
        ? `?clientId=${selectedClient.id}&asOfDate=${asOfDate}` 
        : `?asOfDate=${asOfDate}`;
      
      console.log('Fetching balance sheet data from API...');
      console.log('Query params:', queryParams);
      
      const response = await fetch(
        `${ENDPOINTS.REPORTS_BASE}/balance-sheet/data${queryParams}`,
        {
          method: "GET",
          headers,
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance sheet: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('Balance sheet data received:', result);
      
      if (result.success && result.data) {
        setBalanceSheetItems(result.data);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('Error fetching balance sheet data:', error);
      setError('Failed to load balance sheet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheetData();
  }, [selectedClient]); // Re-fetch when client changes

  // Process data for reports and charts
  const processBalanceSheetData = (): BalanceSheetData => {
    const currentAssets = balanceSheetItems
      .filter(item => item.type === 'current-asset')
      .map(item => ({ name: item.name, value: item.amount }));
    
    const fixedAssets = balanceSheetItems
      .filter(item => item.type === 'fixed-asset')
      .map(item => ({ name: item.name, value: item.amount }));
    
    const currentLiabilities = balanceSheetItems
      .filter(item => item.type === 'current-liability')
      .map(item => ({ name: item.name, value: item.amount }));
    
    const longTermLiabilities = balanceSheetItems
      .filter(item => item.type === 'long-term-liability')
      .map(item => ({ name: item.name, value: item.amount }));
    
    const equity = balanceSheetItems
      .filter(item => item.type === 'equity')
      .map(item => ({ name: item.name, value: item.amount }));

    const totalCurrentAssets = currentAssets.reduce((sum, item) => sum + item.value, 0);
    const totalFixedAssets = fixedAssets.reduce((sum, item) => sum + item.value, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalCurrentLiabilities = currentLiabilities.reduce((sum, item) => sum + item.value, 0);
    const totalLongTermLiabilities = longTermLiabilities.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const totalEquity = equity.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    return {
      currentAssets,
      fixedAssets,
      totalAssets,
      currentLiabilities,
      longTermLiabilities,
      totalLiabilities,
      equity,
      totalEquity,
      totalLiabilitiesAndEquity,
      asOfDate: new Date()
    };
  };

  const balanceSheetData = processBalanceSheetData();

  // Extract chart data for export
  const extractChartData = () => {
    return {
      totalAssets: balanceSheetData.totalAssets,
      totalCurrentAssets: balanceSheetData.currentAssets.reduce((sum, item) => sum + item.value, 0),
      totalFixedAssets: balanceSheetData.fixedAssets.reduce((sum, item) => sum + item.value, 0),
      totalLiabilities: balanceSheetData.totalLiabilities,
      totalCurrentLiabilities: balanceSheetData.currentLiabilities.reduce((sum, item) => sum + item.value, 0),
      totalLongTermLiabilities: balanceSheetData.longTermLiabilities.reduce((sum, item) => sum + item.value, 0),
      totalEquity: balanceSheetData.totalEquity,
      assetBreakdown: [
        ...balanceSheetData.currentAssets.map(item => ({ category: item.name, amount: item.value, type: 'Current Asset' })),
        ...balanceSheetData.fixedAssets.map(item => ({ category: item.name, amount: item.value, type: 'Fixed Asset' }))
      ],
      liabilityBreakdown: [
        ...balanceSheetData.currentLiabilities.map(item => ({ category: item.name, amount: item.value, type: 'Current Liability' })),
        ...balanceSheetData.longTermLiabilities.map(item => ({ category: item.name, amount: item.value, type: 'Long Term Liability' })),
        ...balanceSheetData.equity.map(item => ({ category: item.name, amount: item.value, type: 'Equity' }))
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Balance Sheet</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchBalanceSheetData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportHeader 
        title="Balance Sheet"
        description="Assets, Liabilities, and Equity"
        reportType="balance-sheet"
        reportData={extractChartData()}
      />
      <BalanceSheetReport data={balanceSheetData} />
      <BalanceSheetChart data={balanceSheetData} />
    </div>
  )
}

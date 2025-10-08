"use client"

import { ProfitLossReport } from "@/components/reporting/profit-loss-report"
import { ProfitLossChart } from "@/components/reporting/profit-loss-chart"
import { ReportHeader } from "@/components/reporting/report-header"
import { useState, useEffect } from "react"
import { ENDPOINTS } from "@/lib/config"

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  description: string;
}

interface ReportData {
  revenue: number;
  otherIncome: number;
  totalRevenue: number;
  expenses: Array<{ name: string; value: number }>;
  cogs: number;
  operatingExpenses: number;
  adminExpenses: number;
  marketingExpenses: number;
  totalExpenses: number;
  netProfit: number;
  period?: any;
}

export default function ProfitLossPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      console.log('Fetching transactions from:', ENDPOINTS.TRANSACTIONS.LIST);
      
      const response = await fetch(ENDPOINTS.TRANSACTIONS.LIST, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched transactions:', data);
      setTransactions(data);

    } catch (err: any) {
      console.error('Transaction fetch error:', err);
      setError(err.message);
      
      // Set empty array to show no data state
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <ReportHeader
        title="Profit & Loss Statement"
        description="Comprehensive financial analysis for the selected period"
        reportType="profit-loss"
        reportData={{ businessName: 'Your Business', transactions }}
      />

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-amber-600 text-sm">
              ⚠️ Error loading data: {error}
            </div>
          </div>
        </div>
      )}

      {/* Main Financial Statement */}
      <div className="mb-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Financial Statement</h2>
          <p className="text-gray-600">Detailed breakdown of revenue, expenses, and net profit</p>
        </div>
        <ProfitLossReport 
          transactions={transactions}
          loading={loading}
          onRefresh={fetchTransactions}
        />
      </div>

      {/* Financial Analysis Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Financial Analysis</h2>
          <p className="text-gray-600">Visual breakdown and trends of your financial data</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Charts Column */}
          <div className="xl:col-span-2">
            <ProfitLossChart 
              transactions={transactions}
              loading={loading}
              onRefresh={fetchTransactions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

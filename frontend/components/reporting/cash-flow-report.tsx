"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

const cashFlowData = {
  operatingActivities: {
    netIncome: 450000,
    depreciation: 25000,
    accountsReceivable: -15000,
    accountsPayable: 8000,
    inventory: -12000,
    total: 456000,
  },
  investingActivities: {
    equipmentPurchase: -75000,
    investmentSale: 20000,
    total: -55000,
  },
  financingActivities: {
    loanRepayment: -30000,
    dividendPayment: -25000,
    total: -55000,
  },
}

export function CashFlowReport() {
  const netCashFlow =
    cashFlowData.operatingActivities.total +
    cashFlowData.investingActivities.total +
    cashFlowData.financingActivities.total

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0
    const formatted = `₹${Math.abs(amount).toLocaleString()}`
    return isNegative ? `(${formatted})` : formatted
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <DollarSign className="h-5 w-5" />
          Cash Flow Statement
        </CardTitle>
        <p className="text-sm text-blue-600">For the period ending March 31, 2024</p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Operating Activities */}
        <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">Cash Flow from Operating Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between text-blue-800">
              <span>Net Income</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.netIncome)}</span>
            </div>
            <div className="flex justify-between text-blue-800">
              <span>Depreciation</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.depreciation)}</span>
            </div>
            <div className="flex justify-between text-blue-800">
              <span>Accounts Receivable</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.accountsReceivable)}</span>
            </div>
            <div className="flex justify-between text-blue-800">
              <span>Accounts Payable</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.accountsPayable)}</span>
            </div>
            <div className="flex justify-between text-blue-800">
              <span>Inventory</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.inventory)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2 font-semibold bg-blue-50/50 px-2 py-1 rounded">
              <span className="text-blue-900">Net Cash from Operating Activities</span>
              <span className="flex items-center gap-1 text-blue-900">
                <TrendingUp className="h-4 w-4 text-green-600" />
                {formatCurrency(cashFlowData.operatingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Investing Activities */}
        <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">Cash Flow from Investing Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between text-blue-800">
              <span>Equipment Purchase</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.investingActivities.equipmentPurchase)}</span>
            </div>
            <div className="flex justify-between text-blue-800">
              <span>Investment Sale</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.investingActivities.investmentSale)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2 font-semibold bg-blue-50/50 px-2 py-1 rounded">
              <span className="text-blue-900">Net Cash from Investing Activities</span>
              <span className="flex items-center gap-1 text-blue-900">
                <TrendingDown className="h-4 w-4 text-red-600" />
                {formatCurrency(cashFlowData.investingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Financing Activities */}
        <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 text-blue-900">Cash Flow from Financing Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between text-blue-800">
              <span>Loan Repayment</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.financingActivities.loanRepayment)}</span>
            </div>
            <div className="flex justify-between text-blue-800">
              <span>Dividend Payment</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.financingActivities.dividendPayment)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2 font-semibold bg-blue-50/50 px-2 py-1 rounded">
              <span className="text-blue-900">Net Cash from Financing Activities</span>
              <span className="flex items-center gap-1 text-blue-900">
                <TrendingDown className="h-4 w-4 text-red-600" />
                {formatCurrency(cashFlowData.financingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="border-t-2 border-blue-300 pt-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded p-4">
          <div className="flex justify-between text-lg font-bold text-blue-900">
            <span>Net Increase in Cash</span>
            <span className="flex items-center gap-1 amount">
              {netCashFlow >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              {formatCurrency(netCashFlow)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

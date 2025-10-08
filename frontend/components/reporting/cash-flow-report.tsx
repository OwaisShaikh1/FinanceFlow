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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cash Flow Statement
        </CardTitle>
        <p className="text-sm text-muted-foreground">For the period ending March 31, 2024</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Operating Activities */}
        <div className="cash-flow-section">
          <h3 className="font-semibold text-lg mb-3 text-primary">Cash Flow from Operating Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between cash-flow-item">
              <span>Net Income</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.netIncome)}</span>
            </div>
            <div className="flex justify-between cash-flow-item">
              <span>Depreciation</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.depreciation)}</span>
            </div>
            <div className="flex justify-between cash-flow-item">
              <span>Accounts Receivable</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.accountsReceivable)}</span>
            </div>
            <div className="flex justify-between cash-flow-item">
              <span>Accounts Payable</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.accountsPayable)}</span>
            </div>
            <div className="flex justify-between cash-flow-item">
              <span>Inventory</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.operatingActivities.inventory)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold cash-flow-total">
              <span>Net Cash from Operating Activities</span>
              <span className="flex items-center gap-1 amount">
                <TrendingUp className="h-4 w-4 text-green-600" />
                {formatCurrency(cashFlowData.operatingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Investing Activities */}
        <div className="cash-flow-section">
          <h3 className="font-semibold text-lg mb-3 text-primary">Cash Flow from Investing Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between cash-flow-item">
              <span>Equipment Purchase</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.investingActivities.equipmentPurchase)}</span>
            </div>
            <div className="flex justify-between cash-flow-item">
              <span>Investment Sale</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.investingActivities.investmentSale)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold cash-flow-total">
              <span>Net Cash from Investing Activities</span>
              <span className="flex items-center gap-1 amount">
                <TrendingDown className="h-4 w-4 text-red-600" />
                {formatCurrency(cashFlowData.investingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Financing Activities */}
        <div className="cash-flow-section">
          <h3 className="font-semibold text-lg mb-3 text-primary">Cash Flow from Financing Activities</h3>
          <div className="space-y-2 pl-4">
            <div className="flex justify-between cash-flow-item">
              <span>Loan Repayment</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.financingActivities.loanRepayment)}</span>
            </div>
            <div className="flex justify-between cash-flow-item">
              <span>Dividend Payment</span>
              <span className="font-medium amount">{formatCurrency(cashFlowData.financingActivities.dividendPayment)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold cash-flow-total">
              <span>Net Cash from Financing Activities</span>
              <span className="flex items-center gap-1 amount">
                <TrendingDown className="h-4 w-4 text-red-600" />
                {formatCurrency(cashFlowData.financingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="cash-flow-section border-t-2 pt-4">
          <div className="flex justify-between text-lg font-bold cash-flow-total">
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

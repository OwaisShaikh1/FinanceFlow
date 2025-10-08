"use client"

import { TransactionsList } from "@/components/accounting/transactions-list"
import { TransactionStats } from "@/components/accounting/transaction-stats"
import { TransactionFilters } from "@/components/accounting/transaction-filters"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Income & Expenses
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Track and manage all your business transactions with automated categorization and insights
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Import Bank Statement
            </Button>
            <Link href="/dashboard/transactions/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <TransactionStats />
      <TransactionFilters />
      <TransactionsList />
    </div>
  )
}

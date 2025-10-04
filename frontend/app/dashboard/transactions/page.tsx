"use client"

import { TransactionsList } from "@/components/accounting/transactions-list"
import { TransactionStats } from "@/components/accounting/transaction-stats"
import { TransactionFilters } from "@/components/accounting/transaction-filters"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Income & Expenses</h1>
          <p className="text-muted-foreground">Track and manage all your business transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Bank Statement
          </Button>
          <Link href="/dashboard/transactions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>

      <TransactionStats />
      <TransactionFilters />
      <TransactionsList />
    </div>
  )
}

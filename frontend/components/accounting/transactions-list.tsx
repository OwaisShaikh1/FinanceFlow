"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Paperclip, Eye } from "lucide-react"
import { useState } from "react"
import { useTransactionFilters } from "@/contexts/FilterContext"
import { useSkeletonPreview } from "@/hooks/use-skeleton-preview"
import { useToast } from "@/hooks/use-toast"
import { useDashboard, Transaction } from "@/contexts/DashboardContext"
import { TableSkeleton } from "@/components/ui/skeleton-presets"
import { API_BASE_URL } from "@/lib/config"
import { TransactionEditModal } from "@/components/accounting/transaction-edit-modal"

export function TransactionsList() {
  const { filters } = useTransactionFilters()
  const { toast } = useToast()
  const skeletonPreview = useSkeletonPreview()

  const { transactions, loading: contextLoading, error: contextError, refreshDashboard } = useDashboard()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // optional: for skeleton when deleting
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingTransaction(null)
  }

  const handleTransactionUpdate = () => {
    refreshDashboard()
    handleEditModalClose()
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    const ok = window.confirm("Delete this transaction? This cannot be undone.")
    if (!ok) return
    try {
      setDeletingId(id)
      const res = await fetch(`${API_BASE_URL}/api/transactions/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || `Failed with ${res.status}`)
      }
      toast({ title: "Deleted", description: `Transaction ${id} removed.` })
      // Refresh context to update all pages
      await refreshDashboard()
    } catch (e: any) {
      console.error(e)
      toast({ title: "Delete failed", description: e.message || "Unable to delete", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  // Apply filters
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = filters.search
      ? txn.description.toLowerCase().includes(filters.search.toLowerCase())
      : true
    const matchesType = filters.type === "all" ? true : txn.type === filters.type
    const matchesCategory =
      filters.category === "all" ? true : txn.category.toLowerCase() === filters.category.toLowerCase()
    const txnDate = new Date(txn.date)
    const matchesFrom = filters.dateFrom ? txnDate >= filters.dateFrom : true
    const matchesTo = filters.dateTo ? txnDate <= filters.dateTo : true
    return matchesSearch && matchesType && matchesCategory && matchesFrom && matchesTo
  })

  if (contextLoading || skeletonPreview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton
            columns={["Id", "Date", "Description", "Category", "Type", "Amount", "Payment Method", "Actions"]}
            rows={8}
          />
        </CardContent>
      </Card>
    )
  }

  if (contextError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{contextError}</p>
        </CardContent>
      </Card>
    )
  }

  if (!filteredTransactions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transactions found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell className="font-medium">{transaction.date.split("T")[0]}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.description}
                    {transaction.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                  </div>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                  {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell>{transaction.paymentMethod}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deletingId === transaction.id}
                      aria-disabled={deletingId === transaction.id}
                    >
                      <Trash2 className={`h-4 w-4 ${deletingId === transaction.id ? "opacity-50" : ""}`} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <TransactionEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        transaction={editingTransaction}
        onUpdate={handleTransactionUpdate}
      />
    </Card>
  )
}

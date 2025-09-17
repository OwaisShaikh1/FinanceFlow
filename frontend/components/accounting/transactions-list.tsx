"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Paperclip, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { BASE_URL } from "@/hooks/storagehelper"
import { useTransactionFilters } from "@/contexts/FilterContext"

type Transaction = {
  id: string
  date: string
  type: "income" | "expense"
  description: string
  category: string
  amount: number
  paymentMethod: string
  hasAttachment?: boolean
}

export function TransactionsList() {
  const { filters } = useTransactionFilters()

  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try{
        const res = await fetch(`${BASE_URL}api/transactions`)
        if (!res.ok) throw new Error('Failed to fetch transactions')
        const data = await res.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      }
    }
    fetchTransactions()
  }, [])

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
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

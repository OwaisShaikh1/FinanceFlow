'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Paperclip, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { BASE_URL } from "@/hooks/storagehelper"

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

const mockTransactions = [
  {
    id: "TXN-001",
    date: "2024-12-15",
    type: "income",
    description: "Website Development - ABC Corp",
    category: "Service Income",
    amount: 25000,
    paymentMethod: "Bank Transfer",
    hasAttachment: true,
  },
  {
    id: "TXN-002",
    date: "2024-12-14",
    type: "expense",
    description: "Office Rent - December",
    category: "Office Rent",
    amount: 15000,
    paymentMethod: "Bank Transfer",
    hasAttachment: true,
  },
  {
    id: "TXN-003",
    date: "2024-12-13",
    type: "income",
    description: "Consulting Services - XYZ Ltd",
    category: "Service Income",
    amount: 18000,
    paymentMethod: "UPI",
    hasAttachment: false,
  },
  {
    id: "TXN-004",
    date: "2024-12-12",
    type: "expense",
    description: "Office Supplies",
    category: "Office Supplies",
    amount: 2500,
    paymentMethod: "Credit Card",
    hasAttachment: true,
  },
  {
    id: "TXN-005",
    date: "2024-12-11",
    type: "expense",
    description: "Internet & Phone Bills",
    category: "Utilities",
    amount: 3200,
    paymentMethod: "Bank Transfer",
    hasAttachment: true,
  },
]

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Fetch transactions from backend API when component mounts
    const fetchTransactions = async () => {
      try{
        const res = await fetch(`${BASE_URL}api/transactions`)
        if (!res.ok) throw new Error('Failed to fetch transactions')
        const data = await res.json()
        setTransactions(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
    fetchTransactions()
  }, [])


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
            {transactions.map((transaction) => (
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
                  <Badge variant={transaction.type === "income" ? "default" : "secondary"}>{transaction.type}</Badge>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, AlertCircle, Plus } from "lucide-react"

const mockBankTransactions = [
  {
    id: "BANK-001",
    date: "2024-12-15",
    description: "NEFT CR ABC CORP",
    amount: 25000,
    type: "credit",
    matched: true,
    recordId: "TXN-001",
  },
  {
    id: "BANK-002",
    date: "2024-12-14",
    description: "RENT PAYMENT",
    amount: -15000,
    type: "debit",
    matched: true,
    recordId: "TXN-002",
  },
  {
    id: "BANK-003",
    date: "2024-12-13",
    description: "UPI XYZ LTD",
    amount: 18000,
    type: "credit",
    matched: false,
    recordId: null,
  },
  {
    id: "BANK-004",
    date: "2024-12-12",
    description: "CARD PAYMENT SUPPLIES",
    amount: -2500,
    type: "debit",
    matched: true,
    recordId: "TXN-004",
  },
  {
    id: "BANK-005",
    date: "2024-12-11",
    description: "UTILITY BILLS",
    amount: -3200,
    type: "debit",
    matched: false,
    recordId: null,
  },
]

export function BankReconciliation() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-blue-900">Bank Statement Transactions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-blue-50/50">
                <TableHead className="w-12">Match</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBankTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-blue-50/50">
                  <TableCell>
                    <Checkbox checked={transaction.matched} />
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                    {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {transaction.matched ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Matched
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unmatched
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-blue-900">Reconciliation Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <h4 className="font-medium mb-2 text-blue-900">Unmatched Transactions</h4>
            <p className="text-sm text-blue-700 mb-3">
              2 bank transactions need to be matched with your records
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-white border-blue-200 hover:bg-blue-50 text-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Transaction Record
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-white border-blue-200 hover:bg-blue-50 text-blue-700">
                <Check className="h-4 w-4 mr-2" />
                Match with Existing
              </Button>
            </div>
          </div>

          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
            <h4 className="font-medium mb-2 text-blue-900">Reconciliation Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Bank Balance:</span>
                <span className="font-medium text-blue-900">₹2,85,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Book Balance:</span>
                <span className="font-medium text-blue-900">₹2,82,800</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Difference:</span>
                <span className="font-medium">₹2,200</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Complete Reconciliation</Button>
        </CardContent>
      </Card>
    </div>
  )
}

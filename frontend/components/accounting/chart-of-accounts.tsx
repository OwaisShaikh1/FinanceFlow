import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"

const mockAccounts = [
  {
    id: "ACC-001",
    code: "1000",
    name: "Cash in Hand",
    type: "Asset",
    subType: "Current Asset",
    balance: 50000,
    status: "active",
  },
  {
    id: "ACC-002",
    code: "1100",
    name: "Bank Account - SBI",
    type: "Asset",
    subType: "Current Asset",
    balance: 285000,
    status: "active",
  },
  {
    id: "ACC-003",
    code: "1200",
    name: "Accounts Receivable",
    type: "Asset",
    subType: "Current Asset",
    balance: 125000,
    status: "active",
  },
  {
    id: "ACC-004",
    code: "2000",
    name: "Accounts Payable",
    type: "Liability",
    subType: "Current Liability",
    balance: 85000,
    status: "active",
  },
  {
    id: "ACC-005",
    code: "3000",
    name: "Owner's Equity",
    type: "Equity",
    subType: "Capital",
    balance: 500000,
    status: "active",
  },
  {
    id: "ACC-006",
    code: "4000",
    name: "Service Revenue",
    type: "Income",
    subType: "Operating Revenue",
    balance: 245000,
    status: "active",
  },
  {
    id: "ACC-007",
    code: "5000",
    name: "Office Rent Expense",
    type: "Expense",
    subType: "Operating Expense",
    balance: 180000,
    status: "active",
  },
]

export function ChartOfAccounts() {
  const groupedAccounts = mockAccounts.reduce(
    (acc, account) => {
      if (!acc[account.type]) {
        acc[account.type] = []
      }
      acc[account.type].push(account)
      return acc
    },
    {} as Record<string, typeof mockAccounts>,
  )

  const getBalanceColor = (type: string, balance: number) => {
    if (type === "Asset" || type === "Expense") {
      return balance >= 0 ? "text-green-600" : "text-red-600"
    } else {
      return balance >= 0 ? "text-blue-600" : "text-red-600"
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAccounts).map(([accountType, accounts]) => (
        <Card key={accountType}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{accountType} Accounts</CardTitle>
              <Badge variant="outline">{accounts.length} accounts</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Sub Type</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono">{account.code}</TableCell>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.subType}</TableCell>
                    <TableCell className={getBalanceColor(account.type, account.balance)}>
                      ₹{account.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Plus className="h-4 w-4" />
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
      ))}
    </div>
  )
}

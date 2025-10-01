import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const profitLossData = {
  revenue: [
    { account: "Service Revenue", amount: 245000, percentage: 85.4 },
    { account: "Product Sales", amount: 42000, percentage: 14.6 },
  ],
  expenses: [
    { account: "Office Rent", amount: 36000, percentage: 20.0 },
    { account: "Salaries & Wages", amount: 85000, percentage: 47.2 },
    { account: "Utilities", amount: 12000, percentage: 6.7 },
    { account: "Marketing", amount: 18000, percentage: 10.0 },
    { account: "Professional Services", amount: 15000, percentage: 8.3 },
    { account: "Other Expenses", amount: 14000, percentage: 7.8 },
  ],
}

export function ProfitLossReport() {
  const totalRevenue = profitLossData.revenue.reduce((sum, item) => sum + item.amount, 0)
  const totalExpenses = profitLossData.expenses.reduce((sum, item) => sum + item.amount, 0)
  const netProfit = totalRevenue - totalExpenses

  return (
    <Card data-pdf-section="profit-loss-statement">
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
        <p className="text-sm text-muted-foreground">For the period: December 1-31, 2024</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-600">Revenue</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitLossData.revenue.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.account}</TableCell>
                    <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-semibold">
                  <TableCell>Total Revenue</TableCell>
                  <TableCell className="text-right">₹{totalRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Expenses Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-600">Expenses</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitLossData.expenses.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.account}</TableCell>
                    <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.percentage}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-semibold">
                  <TableCell>Total Expenses</TableCell>
                  <TableCell className="text-right">₹{totalExpenses.toLocaleString()}</TableCell>
                  <TableCell className="text-right">100.0%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Net Profit */}
          <div className="border-t-2 pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Net Profit</span>
              <span className={netProfit >= 0 ? "text-green-600" : "text-red-600"}>₹{netProfit.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Profit Margin: {((netProfit / totalRevenue) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

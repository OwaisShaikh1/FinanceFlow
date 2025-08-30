import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

const balanceSheetData = {
  assets: {
    current: [
      { account: "Cash in Hand", amount: 50000 },
      { account: "Bank Account", amount: 285000 },
      { account: "Accounts Receivable", amount: 125000 },
      { account: "Inventory", amount: 85000 },
    ],
    fixed: [
      { account: "Office Equipment", amount: 150000 },
      { account: "Furniture & Fixtures", amount: 75000 },
      { account: "Computer Systems", amount: 120000 },
    ],
  },
  liabilities: {
    current: [
      { account: "Accounts Payable", amount: 85000 },
      { account: "Accrued Expenses", amount: 25000 },
      { account: "Short-term Loans", amount: 50000 },
    ],
    longTerm: [
      { account: "Long-term Debt", amount: 200000 },
      { account: "Equipment Loan", amount: 75000 },
    ],
  },
  equity: [
    { account: "Owner's Capital", amount: 400000 },
    { account: "Retained Earnings", amount: 150000 },
  ],
}

export function BalanceSheetReport() {
  const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, item) => sum + item.amount, 0)
  const totalFixedAssets = balanceSheetData.assets.fixed.reduce((sum, item) => sum + item.amount, 0)
  const totalAssets = totalCurrentAssets + totalFixedAssets

  const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, item) => sum + item.amount, 0)
  const totalLongTermLiabilities = balanceSheetData.liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0)
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities

  const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
        <p className="text-sm text-muted-foreground">As of December 31, 2024</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Assets</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Assets</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.assets.current.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t font-medium">
                      <TableCell>Total Current Assets</TableCell>
                      <TableCell className="text-right">₹{totalCurrentAssets.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2">Fixed Assets</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.assets.fixed.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t font-medium">
                      <TableCell>Total Fixed Assets</TableCell>
                      <TableCell className="text-right">₹{totalFixedAssets.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t-2 pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Assets</span>
                  <span>₹{totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liabilities & Equity */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-600">Liabilities & Equity</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Liabilities</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.liabilities.current.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t font-medium">
                      <TableCell>Total Current Liabilities</TableCell>
                      <TableCell className="text-right">₹{totalCurrentLiabilities.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2">Long-term Liabilities</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.liabilities.longTerm.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t font-medium">
                      <TableCell>Total Long-term Liabilities</TableCell>
                      <TableCell className="text-right">₹{totalLongTermLiabilities.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2">Equity</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.equity.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t font-medium">
                      <TableCell>Total Equity</TableCell>
                      <TableCell className="text-right">₹{totalEquity.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t-2 pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Liabilities & Equity</span>
                  <span>₹{(totalLiabilities + totalEquity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

interface BalanceSheetData {
  currentAssets: Array<{ name: string; value: number }>;
  fixedAssets: Array<{ name: string; value: number }>;
  totalAssets: number;
  currentLiabilities: Array<{ name: string; value: number }>;
  longTermLiabilities: Array<{ name: string; value: number }>;
  totalLiabilities: number;
  equity: Array<{ name: string; value: number }>;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  asOfDate?: Date;
}

interface BalanceSheetReportProps {
  data?: BalanceSheetData;
}

export function BalanceSheetReport({ data }: BalanceSheetReportProps) {
  // Use provided data or fallback to default
  const balanceSheetData = data || {
    currentAssets: [
      { name: "Cash in Hand", value: 50000 },
      { name: "Bank Account", value: 285000 },
      { name: "Accounts Receivable", value: 125000 },
      { name: "Inventory", value: 85000 },
    ],
    fixedAssets: [
      { name: "Office Equipment", value: 150000 },
      { name: "Furniture & Fixtures", value: 75000 },
      { name: "Computer Systems", value: 120000 },
    ],
    currentLiabilities: [
      { name: "Accounts Payable", value: 85000 },
      { name: "Accrued Expenses", value: 25000 },
      { name: "Short-term Loans", value: 50000 },
    ],
    longTermLiabilities: [
      { name: "Long-term Debt", value: 200000 },
      { name: "Equipment Loan", value: 75000 },
    ],
    equity: [
      { name: "Owner's Capital", value: 400000 },
      { name: "Retained Earnings", value: 150000 },
    ],
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalLiabilitiesAndEquity: 0
  };

  const totalCurrentAssets = balanceSheetData.currentAssets.reduce((sum, item) => sum + item.value, 0);
  const totalFixedAssets = balanceSheetData.fixedAssets.reduce((sum, item) => sum + item.value, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = balanceSheetData.currentLiabilities.reduce((sum, item) => sum + item.value, 0);
  const totalLongTermLiabilities = balanceSheetData.longTermLiabilities.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.value, 0);

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
                    {balanceSheetData.currentAssets.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
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
                    {balanceSheetData.fixedAssets.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
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
                    {balanceSheetData.currentLiabilities.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
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
                    {balanceSheetData.longTermLiabilities.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
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
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
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

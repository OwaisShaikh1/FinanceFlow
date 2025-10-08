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
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="text-blue-900">Balance Sheet</CardTitle>
        <p className="text-sm text-blue-600">As of December 31, 2024</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assets */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Assets</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-blue-700">Current Assets</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.currentAssets.map((item, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-800">{item.name}</TableCell>
                        <TableCell className="text-right text-blue-800">₹{item.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-blue-200 font-medium bg-blue-50/50">
                      <TableCell className="text-blue-900">Total Current Assets</TableCell>
                      <TableCell className="text-right text-blue-900">₹{totalCurrentAssets.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-blue-700">Fixed Assets</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.fixedAssets.map((item, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-800">{item.name}</TableCell>
                        <TableCell className="text-right text-blue-800">₹{item.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-blue-200 font-medium bg-blue-50/50">
                      <TableCell className="text-blue-900">Total Fixed Assets</TableCell>
                      <TableCell className="text-right text-blue-900">₹{totalFixedAssets.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t-2 border-blue-300 pt-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded p-3">
                <div className="flex justify-between font-bold text-lg text-blue-900">
                  <span>Total Assets</span>
                  <span>₹{totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liabilities & Equity */}
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Liabilities & Equity</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-blue-700">Current Liabilities</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.currentLiabilities.map((item, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-800">{item.name}</TableCell>
                        <TableCell className="text-right text-blue-800">₹{item.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-blue-200 font-medium bg-blue-50/50">
                      <TableCell className="text-blue-900">Total Current Liabilities</TableCell>
                      <TableCell className="text-right text-blue-900">₹{totalCurrentLiabilities.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-blue-700">Long-term Liabilities</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.longTermLiabilities.map((item, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-800">{item.name}</TableCell>
                        <TableCell className="text-right text-blue-800">₹{item.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-blue-200 font-medium bg-blue-50/50">
                      <TableCell className="text-blue-900">Total Long-term Liabilities</TableCell>
                      <TableCell className="text-right text-blue-900">₹{totalLongTermLiabilities.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-blue-700">Equity</h4>
                <Table>
                  <TableBody>
                    {balanceSheetData.equity.map((item, index) => (
                      <TableRow key={index} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-800">{item.name}</TableCell>
                        <TableCell className="text-right text-blue-800">₹{item.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t border-blue-200 font-medium bg-blue-50/50">
                      <TableCell className="text-blue-900">Total Equity</TableCell>
                      <TableCell className="text-right text-blue-900">₹{totalEquity.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="border-t-2 border-blue-300 pt-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded p-3">
                <div className="flex justify-between font-bold text-lg text-blue-900">
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

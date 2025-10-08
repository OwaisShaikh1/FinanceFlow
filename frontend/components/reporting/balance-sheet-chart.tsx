"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"

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

interface BalanceSheetChartProps {
  data?: BalanceSheetData;
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#8b5a2b"];

export function BalanceSheetChart({ data }: BalanceSheetChartProps) {
  if (!data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">No data available for charts</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare asset breakdown data
  const assetBreakdown = [
    { name: "Current Assets", value: data.currentAssets.reduce((sum, item) => sum + item.value, 0), color: COLORS[0] },
    { name: "Fixed Assets", value: data.fixedAssets.reduce((sum, item) => sum + item.value, 0), color: COLORS[1] },
  ];

  // Prepare detailed asset breakdown
  const detailedAssetBreakdown = [
    ...data.currentAssets.map((item, index) => ({ ...item, color: COLORS[index % COLORS.length] })),
    ...data.fixedAssets.map((item, index) => ({ ...item, color: COLORS[(index + data.currentAssets.length) % COLORS.length] })),
  ];

  // Prepare liability & equity breakdown
  const liabilityEquityBreakdown = [
    { name: "Current Liabilities", value: data.currentLiabilities.reduce((sum, item) => sum + item.value, 0), color: COLORS[2] },
    { name: "Long Term Liabilities", value: data.longTermLiabilities.reduce((sum, item) => sum + item.value, 0), color: COLORS[3] },
    { name: "Equity", value: data.totalEquity, color: COLORS[4] },
  ];

  // Calculate financial ratios
  const totalCurrentAssets = data.currentAssets.reduce((sum, item) => sum + item.value, 0);
  const totalCurrentLiabilities = data.currentLiabilities.reduce((sum, item) => sum + item.value, 0);
  const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
  const debtToEquityRatio = data.totalEquity > 0 ? data.totalLiabilities / data.totalEquity : 0;
  const equityRatio = data.totalAssets > 0 ? (data.totalEquity / data.totalAssets) * 100 : 0;

  const ratioData = [
    { name: "Current Ratio", value: Number(currentRatio.toFixed(2)), benchmark: 2.0 },
    { name: "Debt-to-Equity", value: Number(debtToEquityRatio.toFixed(2)), benchmark: 1.0 },
    { name: "Equity %", value: Number(equityRatio.toFixed(1)), benchmark: 50 },
  ];
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Asset Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {assetBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratioData} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" name="Actual" />
                <Bar dataKey="benchmark" fill="hsl(var(--chart-2))" name="Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

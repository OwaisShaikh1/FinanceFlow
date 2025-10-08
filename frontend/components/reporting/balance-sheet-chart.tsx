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
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="text-center text-blue-600">No data available for charts</div>
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
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="text-blue-900">Asset Composition</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {assetBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50/50 rounded">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-blue-800">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="text-blue-900">Financial Ratios & Analysis</CardTitle>
          <p className="text-sm text-blue-600">Key financial health indicators</p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Ratio Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {ratioData.map((ratio, index) => {
              const isGood = ratio.name === "Current Ratio" 
                ? ratio.value >= ratio.benchmark 
                : ratio.name === "Debt-to-Equity" 
                ? ratio.value <= ratio.benchmark 
                : ratio.value >= ratio.benchmark;
              
              return (
                <div key={index} className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">{ratio.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${isGood ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Current:</span>
                      <span className="text-lg font-bold text-blue-900">
                        {ratio.name === "Equity %" ? `${ratio.value}%` : ratio.value}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-600">Benchmark:</span>
                      <span className="text-sm text-blue-700">
                        {ratio.name === "Equity %" ? `${ratio.benchmark}%` : ratio.benchmark}
                      </span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${isGood ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ 
                          width: `${Math.min((ratio.value / (ratio.benchmark * 1.5)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="h-64 bg-white rounded-lg border border-blue-100 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratioData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                <XAxis type="number" tick={{ fontSize: 12, fill: '#1e40af' }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#1e40af' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === "Equity %" ? `${value}%` : value.toFixed(2),
                    name
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Actual" radius={[0, 4, 4, 0]} />
                <Bar dataKey="benchmark" fill="#06b6d4" name="Benchmark" radius={[0, 4, 4, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ratio Explanations */}
          <div className="mt-6 bg-blue-50/50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-3">Ratio Explanations</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Current Ratio:</span>
                <span className="text-blue-600">Ability to pay short-term obligations (≥2.0 is good)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Debt-to-Equity:</span>
                <span className="text-blue-600">Financial leverage (≤1.0 is conservative)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Equity %:</span>
                <span className="text-blue-600">Ownership stake in total assets (≥50% is strong)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

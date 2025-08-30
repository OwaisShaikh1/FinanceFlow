import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, BarChart3, TrendingUp, DollarSign, PieChart, Calculator } from "lucide-react"
import Link from "next/link"

const reports = [
  {
    title: "Profit & Loss Statement",
    description: "Income and expenses analysis",
    icon: TrendingUp,
    href: "/dashboard/reports/profit-loss",
    color: "bg-green-500",
  },
  {
    title: "Balance Sheet",
    description: "Assets, liabilities, and equity",
    icon: BarChart3,
    href: "/dashboard/reports/balance-sheet",
    color: "bg-blue-500",
  },
  {
    title: "Cash Flow Statement",
    description: "Cash inflows and outflows",
    icon: DollarSign,
    href: "/dashboard/reports/cash-flow",
    color: "bg-purple-500",
  },
  {
    title: "Trial Balance",
    description: "Account balances verification",
    icon: Calculator,
    href: "/dashboard/reports/trial-balance",
    color: "bg-orange-500",
  },
  {
    title: "GST Summary",
    description: "GST collections and payments",
    icon: FileText,
    href: "/dashboard/tax-reports",
    color: "bg-red-500",
  },
  {
    title: "Custom Reports",
    description: "Build your own reports",
    icon: PieChart,
    href: "/dashboard/reports/custom",
    color: "bg-indigo-500",
  },
]

export function ReportCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.color}`}>
                <report.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href={report.href}>
              <Button className="w-full">Generate Report</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

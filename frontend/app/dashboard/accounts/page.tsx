import { AssetsLiabilities } from "@/components/accounting/chart-of-accounts"
import { RefreshCw } from "lucide-react"

export default function AccountsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Assets & Liabilities
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              View your financial position and track net worth with real-time data from transactions
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
            <RefreshCw className="h-4 w-4 text-green-700" />
            <span className="text-sm font-medium text-green-700">Live Data</span>
          </div>
        </div>
      </div>

      <AssetsLiabilities />
    </div>
  )
}

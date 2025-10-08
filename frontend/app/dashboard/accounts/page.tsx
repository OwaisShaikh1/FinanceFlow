import { ChartOfAccounts } from "@/components/accounting/chart-of-accounts"
import { AccountStats } from "@/components/accounting/account-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AccountsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Chart of Accounts
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage your business accounts and track journal entries with comprehensive financial categorization
            </p>
          </div>
          <Link href="/dashboard/accounts/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </Link>
        </div>
      </div>

      <AccountStats />
      <ChartOfAccounts />
    </div>
  )
}

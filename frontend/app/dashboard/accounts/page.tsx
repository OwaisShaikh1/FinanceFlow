import { ChartOfAccounts } from "@/components/accounting/chart-of-accounts"
import { AccountStats } from "@/components/accounting/account-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chart of Accounts</h1>
          <p className="text-muted-foreground">Manage your business accounts and track journal entries</p>
        </div>
        <Link href="/dashboard/accounts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </Link>
      </div>

      <AccountStats />
      <ChartOfAccounts />
    </div>
  )
}

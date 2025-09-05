import React, { Suspense, lazy } from "react"

const DashboardStats = lazy(() => import("@/components/dashboard/dashboard-stats"))
const RecentActivity = lazy(() => import("@/components/dashboard/recent-activity"))
const ComplianceAlerts = lazy(() => import("@/components/dashboard/compliance-alerts"))
const QuickActions = lazy(() => import("@/components/dashboard/quick-actions"))
const FinancialChart = lazy(() => import("@/components/dashboard/financial-chart"))


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial health and compliance status
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading chart...</div>}>
            <FinancialChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div>Loading quick actions...</div>}>
            <QuickActions />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading activity...</div>}>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={<div>Loading alerts...</div>}>
          <ComplianceAlerts />
        </Suspense>
      </div>
    </div>
  )
}


"use client";
import React, { Suspense, lazy } from "react"

const DashboardStats = lazy(() => import("@/components/dashboard/dashboard-stats"))
const RecentActivity = lazy(() => import("@/components/dashboard/recent-activity"))
const ComplianceAlerts = lazy(() => import("@/components/dashboard/compliance-alerts"))
const QuickActions = lazy(() => import("@/components/dashboard/quick-actions"))
const FinancialChart = lazy(() => import("@/components/dashboard/financial-chart"))
const MetricsOverview = lazy(() => import("@/components/dashboard/metrics-overview").then(m => ({ default: m.MetricsOverview })))


export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Overview of your financial health and compliance status with comprehensive business insights
          </p>
        </div>
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

      <Suspense fallback={<div>Loading metrics...</div>}>
        <MetricsOverview />
      </Suspense>

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


"use client";
import React, { Suspense, lazy, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const DashboardStats = lazy(() => import("@/components/dashboard/dashboard-stats"))
const RecentActivity = lazy(() => import("@/components/dashboard/recent-activity"))
const ComplianceAlerts = lazy(() => import("@/components/dashboard/compliance-alerts"))
const QuickActions = lazy(() => import("@/components/dashboard/quick-actions"))
const FinancialChart = lazy(() => import("@/components/dashboard/financial-chart"))
const MetricsOverview = lazy(() => import("@/components/dashboard/metrics-overview").then(m => ({ default: m.MetricsOverview })))


export default function DashboardPage() {
  const { toast } = useToast()

  useEffect(() => {
    // Check if this is a new user and show welcome message
    const showWelcome = localStorage.getItem("showWelcome")
    const user = localStorage.getItem("user")
    
    if (showWelcome === "true" && user) {
      try {
        const userData = JSON.parse(user)
        toast({
          title: "Welcome to TaxPro! 🎉",
          description: `Hello ${userData.displayName || userData.name || "there"}! Your account has been created successfully. Let's get started with managing your finances.`,
          duration: 5000,
        })
        // Clear the welcome flag
        localStorage.removeItem("showWelcome")
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [toast])

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


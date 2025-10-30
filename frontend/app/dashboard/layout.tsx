"use client"
import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext"
import { ClientSelectorBanner } from "@/components/clients/client-selector-banner"
import { useClientContext } from "@/contexts/ClientContext"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useDashboard()
  const { isViewingAsClient } = useClientContext()
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />
      <div className="flex flex-1 relative">
        <DashboardSidebar />
        {/* Main content with responsive left margin based on sidebar state */}
        <main 
          className={`flex-1 p-6 transition-all duration-300 overflow-auto ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
          style={{ height: 'calc(100vh - 82px)' }}
        >
          {isViewingAsClient && <ClientSelectorBanner />}
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  )
}

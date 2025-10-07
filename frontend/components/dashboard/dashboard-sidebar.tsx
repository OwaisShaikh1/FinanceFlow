"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Calculator,
  FileText,
  BarChart3,
  Receipt,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Banknote,
  CreditCard,
  PieChart,
  Calendar,
  AlertTriangle,
  Building,
  CheckSquare,
  Shield,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Add roles to control visibility
const navigationItems = [
  {
    title: "Overview",
    roles: ["Admin", "user", "ca"],
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "user", "ca"] },
    ],
  },
  {
    title: "Accounting & Bookkeeping",
    roles: ["Admin", "ca", "user"],
    items: [
      { title: "Income & Expenses", href: "/dashboard/transactions", icon: TrendingUp, roles: ["Admin", "ca", "user"] },
      { title: "Chart of Accounts", href: "/dashboard/accounts", icon: Calculator, roles: ["Admin"] },
      { title: "Bank Reconciliation", href: "/dashboard/reconciliation", icon: Banknote, roles: ["Admin"] },
    ],
  },
  {
    title: "Billing & Invoicing",
    roles: ["Admin", "user"],
    items: [
      { title: "Invoices", href: "/dashboard/invoices", icon: FileText, roles: ["Admin", "user"] },
      { title: "Recurring Invoices", href: "/dashboard/recurring-invoices", icon: Calendar, roles: ["Admin"] },
      { title: "Payments", href: "/dashboard/payments", icon: CreditCard, roles: ["Admin", "ca"] },
    ],
  },
  {
    title: "Tax Management",
    roles: ["Admin", "user", "ca"],
    items: [
      { title: "GST", href: "/dashboard/gst", icon: Receipt, roles: ["Admin", "user", "ca"] },
      { title: "TDS", href: "/dashboard/tds", icon: Shield, roles: ["Admin", "ca"] },
      { title: "Income Tax", href: "/dashboard/income-tax", icon: Calculator, roles: ["Admin", "user"] },
      { title: "Tax Management", href: "/dashboard/tax", icon: FileText, roles: ["Admin", "ca"] },
    ],
  },
  {
    title: "Reporting",
    roles: ["Admin", "user"],
    items: [
      { title: "Financial Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["Admin","user"] },
      { title: "Tax Reports", href: "/dashboard/tax-reports", icon: PieChart, roles: ["Admin", "user"] },
    ],
  },
  {
    title: "Task Management",
    roles: ["Admin", "ca"],
    items: [
      { title: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, roles: ["Admin", "ca"] },
    ],
  },
  {
    title: "Client Management",
    roles: ["Admin", "ca"],
    items: [
      { title: "Clients", href: "/dashboard/clients", icon: Users, roles: ["Admin"] },
      { title: "Organizations", href: "/dashboard/organizations", icon: Building, roles: ["Admin"] },
    ],
  },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [role, setRole] = useState<string>("user")
  const pathname = usePathname()

  useEffect(() => {
    // Get user from localStorage (example: { "role": "Admin" })
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setRole(user?.role || null)
  }, [])

  return (
    <div className={cn("border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex flex-col min-h-[calc(100vh-82px)]">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-lg font-semibold text-primary">Navigation</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Scrollable navigation items */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-6">
            {navigationItems
              .filter((section) => !role || section.roles.includes(role))
              .map((section, index) => (
                <div key={index}>
                  {!collapsed && (
                    <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {section.items
                      .filter((item) => !role || item.roles.includes(role))
                      .map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              collapsed ? "px-2" : "px-3",
                              pathname === item.href && "bg-primary/10 text-primary"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span className="ml-3">{item.title}</span>}
                          </Button>
                        </Link>
                      ))}
                  </div>
                  {index < navigationItems.length - 1 && !collapsed && <Separator className="my-4" />}
                </div>
              ))}
          </div>
        </ScrollArea>

        {/* Settings button at the bottom */}
        <div className="p-3">
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="ml-3">Settings</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>

  )
}

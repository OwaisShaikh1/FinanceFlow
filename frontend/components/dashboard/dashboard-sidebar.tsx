"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Accounting & Bookkeeping",
    items: [
      {
        title: "Income & Expenses",
        href: "/dashboard/transactions",
        icon: TrendingUp,
      },
      {
        title: "Chart of Accounts",
        href: "/dashboard/accounts",
        icon: Calculator,
      },
      {
        title: "Bank Reconciliation",
        href: "/dashboard/reconciliation",
        icon: Banknote,
      },
    ],
  },
  {
    title: "Billing & Invoicing",
    items: [
      {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: FileText,
      },
      {
        title: "Recurring Invoices",
        href: "/dashboard/recurring-invoices",
        icon: Calendar,
      },
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        title: "Financial Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
      {
        title: "Tax Reports",
        href: "/dashboard/tax-reports",
        icon: PieChart,
      },
    ],
  },
  {
    title: "Tax & Compliance",
    items: [
      {
        title: "GST Filing",
        href: "/dashboard/gst",
        icon: Receipt,
      },
      {
        title: "TDS Management",
        href: "/dashboard/tds",
        icon: TrendingDown,
      },
      {
        title: "Income Tax",
        href: "/dashboard/income-tax",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Client Management",
    items: [
      {
        title: "Clients",
        href: "/dashboard/clients",
        icon: Users,
      },
      {
        title: "Organizations",
        href: "/dashboard/organizations",
        icon: Building,
      },
    ],
  },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn("border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h2 className="text-lg font-semibold text-primary">Navigation</h2>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-6">
            {navigationItems.map((section, index) => (
              <div key={index}>
                {!collapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          collapsed ? "px-2" : "px-3",
                          pathname === item.href && "bg-primary/10 text-primary",
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

        <div className="p-3">
          <Link href="/dashboard/settings">
            <Button variant="ghost" className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}>
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="ml-3">Settings</span>}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

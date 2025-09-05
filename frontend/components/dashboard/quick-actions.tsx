import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Receipt, Calculator, Users } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      title: "Create Invoice",
      description: "Generate a new GST invoice",
      href: "/dashboard/invoices/new",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Record Expense",
      description: "Add a new business expense",
      href: "/dashboard/transactions/new?type=expense",
      icon: Receipt,
      color: "bg-red-500",
    },
    {
      title: "Add Income",
      description: "Record new income entry",
      href: "/dashboard/transactions/new?type=income",
      icon: Plus,
      color: "bg-green-500",
    },
    {
      title: "GST Calculator",
      description: "Calculate GST amounts",
      href: "/dashboard/gst/calculator",
      icon: Calculator,
      color: "bg-purple-500",
    },
    {
      title: "Add Client",
      description: "Register a new client",
      href: "/dashboard/clients/new",
      icon: Users,
      color: "bg-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User, LogOut, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type UserType = {
  name: string
  role?: string
  email?: string
}

export function DashboardHeader() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    // try to load user from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    console.log(user?.name); // will log the logged-in user's name
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Invalid user in localStorage", e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token") // if you stored JWT
    window.location.href = "/auth/login" // redirect
  }

  return (
    <header className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-blue-900">TaxPro Accounting</h1>
            <p className="text-sm text-blue-700">Professional Accounting & Tax Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
            <Input placeholder="Search transactions, invoices..." className="pl-10 w-64 bg-white border-blue-200 hover:border-blue-300 focus:border-blue-400" />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative bg-white border-blue-200 hover:bg-blue-50 text-blue-600">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-600">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium">GST Return Due</p>
                  <p className="text-xs text-muted-foreground">GSTR-3B filing due in 5 days</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm font-medium">Payment Received</p>
                  <p className="text-xs text-muted-foreground">₹25,000 from ABC Corp</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-sm font-medium">New Invoice Created</p>
                  <p className="text-xs text-muted-foreground">Invoice #INV-002 for ₹15,000</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-white border-blue-200 hover:bg-blue-50 text-blue-700">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user?.name || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.role || "Business Owner"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

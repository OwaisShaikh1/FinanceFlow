import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calculator, Sparkles } from "lucide-react"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FinanceFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="#features"
            className="text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              🚀 Get Started FREE
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

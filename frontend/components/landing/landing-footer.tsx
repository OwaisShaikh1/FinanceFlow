import Link from "next/link"
import { Calculator, Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-blue-100 border-t border-blue-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-900">TaxPro</span>
            </div>
            <p className="text-slate-600 text-sm">
              Simplifying tax and accounting for individuals and businesses across India.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/self-service" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Business Suite
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Tax Guides
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-slate-600 hover:text-blue-600 transition-colors">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-200 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>&copy; 2024 TaxPro. All rights reserved. Made with ❤️ for Indian taxpayers.</p>
        </div>
      </div>
    </footer>
  )
}

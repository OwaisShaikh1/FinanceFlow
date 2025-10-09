import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, FileText, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-slate-900">
            Simplify Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tax Filing</span> &
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"> Accounting</span>
          </h1>
          <p className="text-xl text-slate-600 text-pretty mb-8 max-w-2xl mx-auto">
            Complete tax management solution for individuals and businesses. Calculate taxes, file returns, manage
            accounts - all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/self-service">
              <Button size="lg" className="text-lg px-8">
                Calculate My Tax
                <Calculator className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Full Business Suite
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Easy Tax Calculator</h3>
              <p className="text-sm text-slate-600">
                Calculate income tax, GST, and TDS with our smart calculators
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Complete Accounting</h3>
              <p className="text-sm text-slate-600">
                Manage invoices, expenses, and financial reports effortlessly
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">GST Compliance</h3>
              <p className="text-sm text-slate-600">Stay compliant with automated GST filing and calculations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, FileText, Shield, Star, Users, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Trust indicators */}
          <div className="flex items-center justify-center mb-6 space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium">₹50L+ Processed</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-slate-900 leading-tight">
            Simplify Your <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">Tax Filing</span> &
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-gradient"> Accounting</span>
          </h1>
          <p className="text-xl text-slate-600 text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Complete tax management solution for individuals and businesses. Calculate taxes, file returns, manage
            accounts - all in one place with <span className="font-semibold text-blue-700">99.9% accuracy</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/self-service">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                🚀 Calculate My Tax FREE
                <Calculator className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                💼 Full Business Suite
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Special offer banner */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 mb-8">
            <span className="text-sm font-medium text-green-800">
              🎉 Limited Time: Get 3 months FREE on annual plans!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Easy Tax Calculator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculate income tax, GST, and TDS with our <span className="font-medium text-blue-700">AI-powered</span> smart calculators
              </p>
              <div className="mt-2 text-xs text-green-600 font-medium">✓ 99.9% Accurate</div>
            </div>

            <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Complete Accounting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manage invoices, expenses, and financial reports with <span className="font-medium text-blue-700">one-click</span> generation
              </p>
              <div className="mt-2 text-xs text-green-600 font-medium">✓ Cloud Synced</div>
            </div>

            <div className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">GST Compliance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Stay compliant with <span className="font-medium text-blue-700">automated</span> GST filing and real-time calculations
              </p>
              <div className="mt-2 text-xs text-green-600 font-medium">✓ Auto Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

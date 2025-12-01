import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, FileText, Shield, Star, Users, TrendingUp, Sparkles, BarChart3 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 overflow-hidden">
      {/* Animated dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      {/* Floating gradient orbs - lighter for blue background */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-cyan-300/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="text-xs font-semibold text-blue-900 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                ✨ BETTER THAN BRAINPOWER ALONE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-in-up">
              AUTOMATED TAX & FINANCE INSIGHTS
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-xl animate-fade-in-up delay-1">
              FinanceFlow finds hidden gems buried in your data automatically, so you can skip the complex math and act on insight quickly. From anomaly detection to recommendations for improving retention, we make sure you never miss a sign from your users. Finally, an analytics platform that actually does the analysis for you.
            </p>

            {/* CTA Button */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in-up delay-2">
              <Button size="lg" asChild className="text-base px-8 py-6 bg-white text-blue-600 hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/50 border-0 font-bold rounded-lg">
                <Link href="/self-service">
                  See how it works
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">₹50L+ Processed</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative animate-fade-in-up delay-3">
            <div className="relative w-full h-[500px] lg:h-[600px]">
              {/* Isometric illustration placeholder - you can replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Main platform */}
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    {/* Dashboard mockup */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"></div>
                        <div className="h-24 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl"></div>
                        <div className="h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
                        <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <div className="h-2 bg-gray-200 rounded-full w-16"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-2">
                      <Calculator className="w-6 h-6 text-blue-600" />
                      <div className="h-2 bg-gray-200 rounded-full w-20"></div>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

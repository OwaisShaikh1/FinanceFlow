import React, { Suspense, lazy } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RevealOnScroll from "@/components/landing/reveal-on-scroll"

// Lazy imports
const LandingHeader = lazy(() => import("@/components/landing/landing-header").then(m => ({ default: m.LandingHeader })))
const HeroSection = lazy(() => import("@/components/landing/hero-section").then(m => ({ default: m.HeroSection })))
const FeaturesSection = lazy(() => import("@/components/landing/features-section").then(m => ({ default: m.FeaturesSection })))
const PricingSection = lazy(() => import("@/components/landing/pricing-section").then(m => ({ default: m.PricingSection })))
const TestimonialsSection = lazy(() => import("@/components/landing/testimonials-section").then(m => ({ default: m.TestimonialsSection })))
const LandingFooter = lazy(() => import("@/components/landing/landing-footer").then(m => ({ default: m.LandingFooter })))

export default function LandingPage() {
  return (
    <div className="h-screen bg-background">
      <Suspense fallback={<div className="p-4 text-center">Loading header...</div>}>
        <LandingHeader />
      </Suspense>

      <main>
        <RevealOnScroll />
        <Suspense fallback={<div className="p-4 text-center">Loading hero...</div>}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={<div className="p-4 text-center">Loading features...</div>}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<div className="p-4 text-center">Loading pricing...</div>}>
          <PricingSection />
        </Suspense>

        <Suspense fallback={<div className="p-4 text-center">Loading testimonials...</div>}>
          <TestimonialsSection />
        </Suspense>

        {/* Final CTA Section */}
        <section className="py-32 px-4 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                  Ready to Transform Your 
                  <span className="block text-white mt-2">
                    Financial Management?
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-4 leading-relaxed">
                  Join thousands of satisfied users who trust FinanceFlow for their tax and accounting needs.
                </p>
                <p className="text-lg text-white/80">
                  Start your journey to effortless financial management today.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
                <Button size="lg" asChild className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/50 border-0 font-bold">
                  <Link href="/auth/register">
                    🚀 Start Free Trial
                    <span className="ml-2 text-sm font-normal opacity-90">(No Credit Card)</span>
                  </Link>
                </Button>
                <Button size="lg" asChild className="text-lg px-10 py-6 bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white hover:bg-white/30 hover:border-white/70 transform hover:scale-105 transition-all duration-300 shadow-xl font-bold">
                  <Link href="/self-service">
                    💰 Try Tax Calculator Free
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2.5">
                  <span className="text-white">⚡</span>
                  <span className="text-white font-medium">Setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2.5">
                  <span className="text-white">🔒</span>
                  <span className="text-white font-medium">Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2.5">
                  <span className="text-white">📞</span>
                  <span className="text-white font-medium">24/7 support</span>
                </div>
              </div>

              {/* Additional info */}
              <div className="mt-12 p-8 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-black text-white mb-2">
                      14 Days
                    </div>
                    <div className="text-white/80 text-sm">Free Trial Period</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white mb-2">
                      No Setup Fee
                    </div>
                    <div className="text-white/80 text-sm">Get Started Instantly</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white mb-2">
                      Cancel Anytime
                    </div>
                    <div className="text-white/80 text-sm">No Long-term Commitment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Suspense fallback={<div className="p-4 text-center">Loading footer...</div>}>
        <LandingFooter />
      </Suspense>
    </div>
  )
}
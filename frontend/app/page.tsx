import React, { Suspense, lazy } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your <span className="text-yellow-300">Financial Management?</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of satisfied users who trust FinanceFlow for their tax and accounting needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl">
                    🚀 Start Free Trial - No Credit Card Required
                  </Button>
                </Link>
                <Link href="/self-service">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl">
                    💰 Try Tax Calculator Now
                  </Button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-blue-200">
                ⚡ Setup in 2 minutes • 🔒 Bank-level security • 📞 24/7 support
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

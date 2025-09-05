import React, { Suspense, lazy } from "react"

// Lazy imports
const LandingHeader = lazy(() => import("@/components/landing/landing-header").then(m => ({ default: m.LandingHeader })))
const HeroSection = lazy(() => import("@/components/landing/hero-section").then(m => ({ default: m.HeroSection })))
const FeaturesSection = lazy(() => import("@/components/landing/features-section").then(m => ({ default: m.FeaturesSection })))
const PricingSection = lazy(() => import("@/components/landing/pricing-section").then(m => ({ default: m.PricingSection })))
const TestimonialsSection = lazy(() => import("@/components/landing/testimonials-section").then(m => ({ default: m.TestimonialsSection })))
const LandingFooter = lazy(() => import("@/components/landing/landing-footer").then(m => ({ default: m.LandingFooter })))

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
      </main>

      <Suspense fallback={<div className="p-4 text-center">Loading footer...</div>}>
        <LandingFooter />
      </Suspense>
    </div>
  )
}

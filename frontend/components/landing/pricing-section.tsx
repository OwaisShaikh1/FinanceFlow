import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Individual",
      price: "Free",
      period: "Forever",
      description: "Perfect for personal tax calculations",
      features: ["Income Tax Calculator", "Basic GST Calculator", "TDS Calculator", "Tax Saving Tips", "Email Support"],
      cta: "Start Free",
      href: "/self-service",
      popular: false,
      gradient: "from-slate-500 to-slate-700",
      icon: Sparkles,
      bgGradient: "from-slate-50 to-slate-100"
    },
    {
      name: "Small Business",
      price: "₹999",
      period: "per month",
      description: "Complete accounting for small businesses",
      features: [
        "All Individual features",
        "GST-compliant Invoicing",
        "Expense Tracking",
        "Financial Reports",
        "Bank Reconciliation",
        "Priority Support",
      ],
      cta: "Start Trial",
      href: "/auth/register",
      popular: true,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      icon: Zap,
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      name: "Enterprise",
      price: "₹2,999",
      period: "per month",
      description: "For CAs and large businesses",
      features: [
        "All Small Business features",
        "Multi-client Management",
        "Team Collaboration",
        "Advanced Reports",
        "API Access",
        "Dedicated Support",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
      gradient: "from-violet-500 to-purple-700",
      icon: Crown,
      bgGradient: "from-violet-50 to-purple-50"
    },
  ]

  return (
    <section id="pricing" className="py-24 px-4 relative overflow-hidden bg-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #60a5fa 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-5 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Simple, transparent pricing</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-gray-900 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mt-2">
              Perfect Plan
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Start free with our tax calculators, or unlock the full power of automated accounting.
          </p>
          
          {/* Special offer banner */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-green-500/30">
            <Sparkles className="w-4 h-4" />
            <span>Limited Time: 3 months FREE on annual plans!</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`relative group reveal reveal-delay-${index} ${
                  plan.popular ? 'md:scale-105' : ''
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`relative h-full bg-white rounded-3xl p-8 border-2 ${
                  plan.popular 
                    ? 'border-blue-300 shadow-2xl shadow-blue-500/20' 
                    : 'border-gray-200'
                } backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular ? 'hover:shadow-blue-500/30' : 'hover:shadow-gray-300'
                }`}>
                  
                  {/* Gradient overlay for popular plan */}
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-50"></div>
                  )}

                  {/* Icon */}
                  <div className={`relative mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Plan name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-black bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                    
                    {plan.name === "Small Business" && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Save ₹2,000 annually!
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild
                    className={`w-full py-6 text-base font-bold rounded-xl transition-all duration-300 mb-8 ${
                      plan.popular 
                        ? `bg-gradient-to-r ${plan.gradient} hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 text-white border-0` 
                        : `bg-gray-100 hover:bg-gray-200 text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:scale-105`
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                      {plan.popular && <Zap className="ml-2 w-4 h-4" />}
                    </Link>
                  </Button>

                  {/* Features */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-br ${plan.gradient}`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/0 to-cyan-50/0 group-hover:from-blue-50/30 group-hover:to-cyan-50/30 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">All plans include 14-day free trial • No credit card required</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              24/7 Support
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Secure payments
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

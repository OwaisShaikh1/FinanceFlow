import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Individual",
      price: "Free",
      description: "Perfect for personal tax calculations",
      features: ["Income Tax Calculator", "Basic GST Calculator", "TDS Calculator", "Tax Saving Tips", "Email Support"],
      cta: "Start Free",
      href: "/self-service",
      popular: false,
    },
    {
      name: "Small Business",
      price: "₹999/month",
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
    },
    {
      name: "Enterprise",
      price: "₹2,999/month",
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
    },
  ]

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-slate-900">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h2>
          <p className="text-xl text-slate-600 text-pretty max-w-2xl mx-auto">
            Start free with our tax calculators, or upgrade for complete business accounting solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white ${plan.popular ? "border-blue-500 shadow-lg shadow-blue-100/50 scale-105" : "border-blue-200"} hover:shadow-lg transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-slate-900">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-blue-600 mb-2">{plan.price}</div>
                <CardDescription className="text-slate-600">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className="block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

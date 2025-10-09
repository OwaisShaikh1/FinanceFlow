import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, BarChart3, Shield, Users, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Calculator,
      title: "Smart Tax Calculators",
      description:
        "Calculate income tax, GST, TDS, and advance tax with precision. Get instant results with our AI-powered calculators.",
    },
    {
      icon: FileText,
      title: "Invoice & Billing",
      description:
        "Create GST-compliant invoices, track payments, and manage recurring billing with professional templates.",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description: "Generate P&L statements, balance sheets, cash flow reports, and tax summaries with one click.",
    },
    {
      icon: Shield,
      title: "Tax Compliance",
      description: "Stay compliant with automated GST filing, TDS calculations, and income tax return preparation.",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "For CAs: Manage multiple clients, track deadlines, and collaborate with your team efficiently.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get notified about tax deadlines, compliance requirements, and important financial milestones.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-slate-900">
            Everything You Need for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tax & Accounting</span>
          </h2>
          <p className="text-xl text-slate-600 text-pretty max-w-2xl mx-auto">
            From simple tax calculations to comprehensive business accounting, we've got all your financial needs
            covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:border-blue-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Calculator, FileText, BarChart3, Shield, Users, Clock, Sparkles } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Calculator,
      title: "Smart Tax Calculators",
      description:
        "Calculate income tax, GST, TDS, and advance tax with precision. Get instant results with our AI-powered calculators.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: FileText,
      title: "Invoice & Billing",
      description:
        "Create GST-compliant invoices, track payments, and manage recurring billing with professional templates.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description: "Generate P&L statements, balance sheets, cash flow reports, and tax summaries with one click.",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: "Tax Compliance",
      description: "Stay compliant with automated GST filing, TDS calculations, and income tax return preparation.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Client Management",
      description: "For CAs: Manage multiple clients, track deadlines, and collaborate with your team efficiently.",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get notified about tax deadlines, compliance requirements, and important financial milestones.",
      gradient: "from-pink-500 to-purple-600",
    },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #3b82f6 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-5 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight">
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mt-2">
              Tax & Accounting
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From simple tax calculations to comprehensive business accounting, we've got all your financial needs
            covered with cutting-edge technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative reveal reveal-delay-${index}`}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                  
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Shimmer effect on hover */}
                  <div aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-3xl animate-shimmer" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.1) 50%, rgba(59,130,246,0) 100%)", backgroundSize: "200% 100%" }}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trusted by section */}
        <div className="text-center">
          <p className="text-gray-500 text-sm font-medium mb-8 uppercase tracking-wider">Trusted by leading businesses</p>
          
          <div className="relative overflow-hidden">
            <div className="flex flex-wrap gap-6 items-center justify-center">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900 font-semibold">10,000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-900 font-semibold">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="text-gray-900 font-semibold">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

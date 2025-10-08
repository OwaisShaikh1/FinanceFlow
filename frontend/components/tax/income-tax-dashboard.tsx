import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, PiggyBank, FileText, Calendar, TrendingUp, AlertCircle, CheckCircle, Target, ArrowRight, Edit3 } from "lucide-react"

interface IncomeTaxDashboardProps {
  onOpenPlanner?: () => void
}

export function IncomeTaxDashboard({ onOpenPlanner }: IncomeTaxDashboardProps) {
  const stats = [
    {
      title: "Your Tax Liability",
      value: "₹1,25,000",
      change: "For current year",
      subtext: "Annual estimate",
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "calculated"
    },
    {
      title: "Tax Saved",
      value: "₹46,800",
      change: "Through investments",
      subtext: "Section 80C",
      icon: PiggyBank,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "good"
    },
    {
      title: "Advance Tax Paid",
      value: "₹75,000",
      change: "60% completed",
      subtext: "On track",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "progress"
    },
    {
      title: "Next Payment Due",
      value: "₹31,250",
      change: "15th March 2025",
      subtext: "Q4 advance tax",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status: "upcoming"
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "upcoming":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "progress":
        return <TrendingUp className="h-4 w-4 text-purple-600" />
      default:
        return <Target className="h-4 w-4 text-blue-600" />
    }
  }

  const taxSavingProgress = [
  { 
    section: "80C", 
    invested: 150000, 
    limit: 150000, 
    saved: 46800, 
    description: "ELSS, PPF, Life Insurance, NSC", 
    status: "completed"
  },
  { 
    section: "80D", 
    invested: 25000, 
    limit: 25000, 
    saved: 7800, 
    description: "Health insurance premiums", 
    status: "completed" 
  },
  { 
    section: "80G", 
    invested: 10000, 
    limit: 50000, 
    saved: 3120, 
    description: "Charitable donations", 
    status: "partial"
  },
  { 
    section: "80E", 
    invested: 0, 
    limit: 0, 
    saved: 0, 
    description: "Education loan interest", 
    status: "not-applicable"
  },
]


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`shadow-sm border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-shadow relative`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-blue-700">{stat.title}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(stat.status)}
                  <span className="text-xs text-blue-600">{stat.subtext}</span>
                </div>
              </div>
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
              <p className="text-xs text-blue-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-blue-900">Your Tax Saving Journey</CardTitle>
                <p className="text-sm text-blue-700">Track investments and maximize your tax benefits</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹57,720</div>
              <p className="text-sm text-green-700">Total Saved</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {taxSavingProgress.filter(item => item.limit > 0).map((item, index) => {
              const progress = (item.invested / item.limit) * 100;
              const isComplete = progress >= 100;
              const hasRoom = progress < 100;
              
              return (
                <div key={index} className="space-y-2 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-900 text-sm">Section {item.section}</span>
                        {isComplete && <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1 py-0">Max</Badge>}
                        {hasRoom && <Badge variant="outline" className="border-orange-200 text-orange-700 text-xs px-1 py-0">Available</Badge>}
                      </div>
                      <p className="text-xs text-blue-600 mt-1 leading-tight">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-700">
                          ₹{item.invested.toLocaleString()} / ₹{item.limit.toLocaleString()}
                        </span>
                        <span className="text-xs font-medium text-green-600">
                          ₹{item.saved.toLocaleString()} saved
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {hasRoom && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-2 py-1 h-6 border-blue-200 hover:bg-blue-50 text-blue-700"
                          onClick={() => {
                            onOpenPlanner?.()
                            const element = document.querySelector('#tax-saving-planner');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                              setTimeout(() => {
                                const sectionElement = document.querySelector(`[data-section="${item.section}"]`);
                                if (sectionElement) {
                                  sectionElement.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-75');
                                  setTimeout(() => {
                                    sectionElement.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-75');
                                  }, 3000);
                                }
                              }, 1000);
                            }
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={`h-2 ${progress > 100 ? "bg-red-100 [&_div]:bg-red-500" : "bg-blue-100 [&_div]:bg-blue-600"}`} 
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-600">{progress.toFixed(0)}%</span>
                      {hasRoom && (
                        <span className="text-orange-600">
                          ₹{(item.limit - item.invested).toLocaleString()} left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Enhanced Call-to-Action - Compact */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 col-span-full">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-1 bg-blue-100 rounded">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1 text-sm">Maximize Your Savings</h4>
                    <p className="text-xs text-blue-700">
                      ₹{taxSavingProgress.filter(item => item.limit > 0).reduce((acc, item) => acc + (item.limit - item.invested), 0).toLocaleString()} more available for investment
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                  onClick={() => {
                    onOpenPlanner?.()
                    const element = document.querySelector('#tax-saving-planner');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => {
                        element.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50');
                        setTimeout(() => {
                          element.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
                        }, 2000);
                      }, 500);
                    }
                  }}
                >
                  <Calculator className="h-3 w-3 mr-1" />
                  Open Planner
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

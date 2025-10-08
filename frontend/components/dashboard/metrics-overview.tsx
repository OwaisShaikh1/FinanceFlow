"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  RadialBarChart, RadialBar, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip 
} from "recharts"
import { Target, Calendar, AlertCircle, CheckCircle } from "lucide-react"

const goalData = [
  { name: 'Revenue', value: 75, target: 100, color: '#3b82f6' },
  { name: 'Profit', value: 60, target: 100, color: '#10b981' },
  { name: 'Expenses', value: 85, target: 100, color: '#ef4444' },
]

const complianceData = [
  { task: 'GST Return', status: 'completed', dueDate: 'Mar 20', progress: 100 },
  { task: 'TDS Return', status: 'pending', dueDate: 'Mar 25', progress: 60 },
  { task: 'ITR Filing', status: 'overdue', dueDate: 'Mar 15', progress: 30 },
  { task: 'Audit Report', status: 'upcoming', dueDate: 'Apr 10', progress: 0 },
]

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Goals Progress */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Target className="h-5 w-5 text-blue-600" />
            Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {goalData.map((goal) => (
              <div key={goal.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">{goal.name}</span>
                  <span className="text-sm text-blue-600">{goal.value}%</span>
                </div>
                <Progress 
                  value={goal.value} 
                  className="h-2 bg-blue-100 [&_div]:bg-blue-600"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart data={goalData} innerRadius="30%" outerRadius="80%">
                <RadialBar 
                  dataKey="value" 
                  cornerRadius={10} 
                  fill="#3b82f6"
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Tasks */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            Compliance Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {complianceData.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-white/50">
                <div className="flex items-center gap-3">
                  {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {task.status === 'pending' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                  {task.status === 'overdue' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  {task.status === 'upcoming' && <Calendar className="h-4 w-4 text-blue-500" />}
                  <div>
                    <p className="text-sm font-medium text-blue-900">{task.task}</p>
                    <p className="text-xs text-blue-600">Due: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      task.status === 'completed' ? 'default' :
                      task.status === 'pending' ? 'secondary' :
                      task.status === 'overdue' ? 'destructive' : 'outline'
                    }
                    className="text-xs"
                  >
                    {task.status}
                  </Badge>
                  <div className="w-16">
                    <Progress value={task.progress} className="h-1 bg-blue-100 [&_div]:bg-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
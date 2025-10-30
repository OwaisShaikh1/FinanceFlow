"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Plus, Filter, Calendar, User, Building2, AlertCircle, Clock, CheckCircle2, MoreVertical, Edit, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface Task {
  _id: string
  title: string
  description: string
  client: string
  clientName: string
  assignedTo: string
  assignedToName: string
  startDate: string
  dueDate: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  taskType: string
  tags: string[]
  createdBy: string
  createdAt: string
}

interface TaskStats {
  totalTasks: number
  tasksThisWeek: number
  dueToday: number
  inProgress: number
  inProgressPercentage: string
  overdue: number
}

const StatCard = ({ title, value, subtitle, icon: Icon, variant }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${variant}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </CardContent>
  </Card>
)

// Task Card with Actions
const TaskCard = ({ task, onUpdate }: { task: Task; onUpdate: () => void }) => {
  const { toast } = useToast()
  
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  const statusColors = {
    pending: "bg-gray-100 text-gray-800 border-gray-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-gray-300 text-gray-900 border-gray-400",
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'UN'
  }

  const getAvatarColor = () => {
    if (task.priority === 'urgent') return 'bg-red-200 text-red-800'
    if (task.priority === 'high') return 'bg-orange-200 text-orange-800'
    return 'bg-emerald-200 text-emerald-800'
  }
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Task status updated" })
        onUpdate()
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast({ title: "Success", description: "Task deleted" })
        onUpdate()
      } else {
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" })
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor()}`}>
              {getInitials(task.assignedToName)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            <span>{task.clientName}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{task.assignedToName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Start: {new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className={statusColors[task.status as keyof typeof statusColors]}>
            {task.status}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            {task.taskType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

// Create Task Dialog
const CreateTaskDialog = ({ open, onOpenChange, onSuccess }: any) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientsFetched, setClientsFetched] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    clientName: "",
    assignedToName: "",
    startDate: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    taskType: "",
  })

  // Fetch clients only once when dialog opens for the first time
  useEffect(() => {
    if (open && !clientsFetched) {
      fetchClients()
    }
  }, [open, clientsFetched])

  const fetchClients = async () => {
    try {
      setClientsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        // Filter only users with role 'user'
        const userClients = data.clients?.filter((client: any) => 
          client.type?.toLowerCase() === 'user' || client.type?.toLowerCase() === 'individual'
        ) || data.clients || []
        setClients(userClients)
        setClientsFetched(true)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive"
      })
    } finally {
      setClientsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          assignedTo: formData.client, // Same as client for now
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create task")
      }

      toast({ title: "Success", description: "Task created successfully" })
      setFormData({
        title: "",
        description: "",
        client: "",
        clientName: "",
        assignedToName: "",
        startDate: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
        taskType: "",
      })
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create task", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (client) {
      setFormData(prev => ({
        ...prev,
        client: clientId,
        clientName: client.name,
        assignedToName: client.name
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold">Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., GST Return Filing - GSTR3B"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Task details..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="client">Select Client *</Label>
              <Select value={formData.client} onValueChange={handleClientSelect} required disabled={clientsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Choose a client"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {clients.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      {clientsLoading ? "Loading..." : "No clients available"}
                    </div>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignedToName">Assigned To</Label>
              <Input
                id="assignedToName"
                value={formData.assignedToName}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedToName: e.target.value }))}
                placeholder="Auto-filled from client"
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="taskType">Task Type *</Label>
              <Select value={formData.taskType} onValueChange={(value) => setFormData(prev => ({ ...prev, taskType: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="GST Compliance">GST Compliance</SelectItem>
                  <SelectItem value="TDS Filing">TDS Filing</SelectItem>
                  <SelectItem value="ITR Filing">ITR Filing</SelectItem>
                  <SelectItem value="Audit">Audit</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t mt-6 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || clientsLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats>({
    totalTasks: 0,
    tasksThisWeek: 0,
    dueToday: 0,
    inProgress: 0,
    inProgressPercentage: "0",
    overdue: 0
  })
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [taskTypeFilter, setTaskTypeFilter] = useState("all")
  const [dueDateFilter, setDueDateFilter] = useState("all")

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching task stats:", error)
    }
  }, [])

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
      await fetchStats()
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tasks", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast, fetchStats])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
      if (taskTypeFilter !== "all" && task.taskType !== taskTypeFilter) return false
      
      if (dueDateFilter !== "all") {
        const now = new Date()
        const taskDate = new Date(task.dueDate)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        
        if (dueDateFilter === "today") {
          const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
          if (taskDate < todayStart || taskDate >= todayEnd) return false
        } else if (dueDateFilter === "week") {
          const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000)
          if (taskDate < todayStart || taskDate >= weekEnd) return false
        } else if (dueDateFilter === "month") {
          const monthEnd = new Date(todayStart.getTime() + 30 * 24 * 60 * 60 * 1000)
          if (taskDate < todayStart || taskDate >= monthEnd) return false
        }
      }
      
      return true
    })
  }, [tasks, statusFilter, priorityFilter, taskTypeFilter, dueDateFilter])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-muted-foreground">Track compliance tasks and deadlines across all clients</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} subtitle={`+${stats.tasksThisWeek} this week`} icon={CheckCircle2} variant="text-blue-600" />
        <StatCard title="Due Today" value={stats.dueToday} subtitle="Needs attention" icon={Calendar} variant="text-orange-600" />
        <StatCard title="In Progress" value={stats.inProgress} subtitle={`${stats.inProgressPercentage}% of total`} icon={Clock} variant="text-blue-600" />
        <StatCard title="Overdue" value={stats.overdue} subtitle="Urgent action" icon={AlertCircle} variant="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter className="h-4 w-4" />Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Task Type</Label>
              <Select value={taskTypeFilter} onValueChange={setTaskTypeFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="GST Compliance">GST Compliance</SelectItem>
                  <SelectItem value="TDS Filing">TDS Filing</SelectItem>
                  <SelectItem value="ITR Filing">ITR Filing</SelectItem>
                  <SelectItem value="Audit">Audit</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Due Date</Label>
              <div className="space-y-2 mt-2">
                <Button
                  variant={dueDateFilter === "today" ? "default" : "outline"}
                  className="w-full justify-start text-sm"
                  onClick={() => setDueDateFilter(dueDateFilter === "today" ? "all" : "today")}
                >
                  <Calendar className="mr-2 h-4 w-4 text-red-600" />
                  Due Today ({stats.dueToday})
                </Button>
                <Button
                  variant={dueDateFilter === "week" ? "default" : "outline"}
                  className="w-full justify-start text-sm"
                  onClick={() => setDueDateFilter(dueDateFilter === "week" ? "all" : "week")}
                >
                  <Calendar className="mr-2 h-4 w-4 text-yellow-600" />
                  This Week
                </Button>
                <Button
                  variant={dueDateFilter === "month" ? "default" : "outline"}
                  className="w-full justify-start text-sm"
                  onClick={() => setDueDateFilter(dueDateFilter === "month" ? "all" : "month")}
                >
                  <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                  This Month
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <Card><CardContent className="p-12 text-center"><div className="animate-pulse">Loading...</div></CardContent></Card>
          ) : filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks available</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
                <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />Create First Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))
          )}
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={fetchTasks}
      />
    </div>
  )
}

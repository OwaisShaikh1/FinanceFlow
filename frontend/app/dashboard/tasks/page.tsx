import { Button } from "@/components/ui/button"
import { TaskStats } from "@/components/tasks/task-stats"
import { TasksList } from "@/components/tasks/tasks-list"
import { TaskFilters } from "@/components/tasks/task-filters"
import { Plus } from "lucide-react"

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Track compliance tasks and deadlines across all clients</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <TaskStats />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <TaskFilters />
        </div>
        <div className="lg:col-span-3">
          <TasksList />
        </div>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share, Printer as Print } from "lucide-react"
import Link from "next/link"

interface ReportHeaderProps {
  title: string
  description: string
  reportType: string
}

export function ReportHeader({ title, description, reportType }: ReportHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Print className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}

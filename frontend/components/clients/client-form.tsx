import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, User, FileText } from "lucide-react"

export function ClientForm() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName" className="text-blue-700">Business Name *</Label>
              <Input id="businessName" placeholder="Enter business name" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
            <div>
              <Label htmlFor="businessType" className="text-blue-700">Business Type *</Label>
              <Select>
                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="company">Private Limited Company</SelectItem>
                  <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                  <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gstin" className="text-blue-700">GSTIN</Label>
              <Input id="gstin" placeholder="27AABCS1234C1Z5" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
            <div>
              <Label htmlFor="pan" className="text-blue-700">PAN Number</Label>
              <Input id="pan" placeholder="AABCS1234C" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-blue-700">Business Address</Label>
            <Textarea id="address" placeholder="Enter complete business address" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson" className="text-blue-700">Contact Person *</Label>
              <Input id="contactPerson" placeholder="Enter contact person name" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
            <div>
              <Label htmlFor="designation" className="text-blue-700">Designation</Label>
              <Input id="designation" placeholder="e.g., Director, Partner" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-blue-700">Email Address *</Label>
              <Input id="email" type="email" placeholder="contact@business.com" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-blue-700">Phone Number *</Label>
              <Input id="phone" placeholder="+91 98765 43210" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="h-5 w-5" />
            Service Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label className="text-base font-medium text-blue-700">Services Required</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {[
                "GST Compliance",
                "Income Tax Filing",
                "TDS Management",
                "Bookkeeping",
                "Payroll Management",
                "Audit Services",
              ].map((service) => (
                <div key={service} className="flex items-center space-x-2 p-2 bg-blue-50/50 rounded hover:bg-blue-50">
                  <Checkbox id={service} className="border-blue-300 text-blue-600" />
                  <Label htmlFor={service} className="text-sm text-blue-800">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billingCycle" className="text-blue-700">Billing Cycle</Label>
              <Select>
                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="project">Project Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="retainerAmount" className="text-blue-700">Retainer Amount</Label>
              <Input id="retainerAmount" placeholder="₹ 0" className="border-blue-200 focus:border-blue-400 focus:ring-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">Save as Draft</Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Client</Button>
      </div>
    </div>
  )
}

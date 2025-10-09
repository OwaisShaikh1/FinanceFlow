"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  User, 
  Building2, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Upload,
  Save,
  RefreshCw
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserSettings {
  // Profile Settings
  fullName: string
  email: string
  phone: string
  avatar: string
  
  // Business Settings
  businessName: string
  businessType: string
  gstin: string
  pan: string
  address: string
  city: string
  state: string
  pincode: string
  
  // Tax Settings
  taxRegime: "old" | "new"
  defaultTaxRate: number
  
  // Notification Settings
  emailNotifications: boolean
  smsNotifications: boolean
  reminderNotifications: boolean
  
  // System Settings
  theme: "light" | "dark" | "auto"
  language: string
  currency: string
  dateFormat: string
  
  // Security Settings
  twoFactorAuth: boolean
  sessionTimeout: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    businessName: "",
    businessType: "",
    gstin: "",
    pan: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    taxRegime: "new",
    defaultTaxRate: 18,
    emailNotifications: true,
    smsNotifications: false,
    reminderNotifications: true,
    theme: "light",
    language: "en",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    twoFactorAuth: false,
    sessionTimeout: 30
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.id) {
        const response = await fetch(`http://localhost:5000/api/user/${user.id}/settings`)
        if (response.ok) {
          const data = await response.json()
          setSettings({ ...settings, ...data })
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      
      const response = await fetch(`http://localhost:5000/api/user/${user.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: "Settings saved successfully!",
          description: "Your preferences have been updated.",
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">
            Manage your account preferences, business information, and system configurations
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadSettings} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-blue-50 border border-blue-200">
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Building2 className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <p className="text-sm text-blue-700">Update your personal information and profile details</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white border-blue-200 hover:border-blue-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white border-blue-200 hover:border-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="bg-white border-blue-200 hover:border-blue-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <p className="text-sm text-blue-700">Configure your business details and tax information</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter business name"
                    className="bg-white border-blue-200 hover:border-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={settings.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                      <SelectItem value="private-limited">Private Limited Company</SelectItem>
                      <SelectItem value="public-limited">Public Limited Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    value={settings.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    placeholder="Enter GSTIN"
                    className="bg-white border-blue-200 hover:border-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    value={settings.pan}
                    onChange={(e) => handleInputChange('pan', e.target.value)}
                    placeholder="Enter PAN number"
                    className="bg-white border-blue-200 hover:border-blue-300"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900">Business Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      value={settings.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      className="bg-white border-blue-200 hover:border-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={settings.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      className="bg-white border-blue-200 hover:border-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={settings.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                      className="bg-white border-blue-200 hover:border-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={settings.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Enter PIN code"
                      className="bg-white border-blue-200 hover:border-blue-300"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900">Tax Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Tax Regime</Label>
                    <Select value={settings.taxRegime} onValueChange={(value: "old" | "new") => handleInputChange('taxRegime', value)}>
                      <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Tax Regime</SelectItem>
                        <SelectItem value="old">Old Tax Regime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="defaultTaxRate"
                      type="number"
                      value={settings.defaultTaxRate}
                      onChange={(e) => handleInputChange('defaultTaxRate', Number(e.target.value))}
                      placeholder="18"
                      className="bg-white border-blue-200 hover:border-blue-300"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Palette className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <p className="text-sm text-blue-700">Customize your application experience and display settings</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(value: "light" | "dark" | "auto") => handleInputChange('theme', value)}>
                    <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="gu">ગુજરાતી</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleInputChange('dateFormat', value)}>
                    <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <p className="text-sm text-blue-700">Configure how and when you receive notifications</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-medium text-slate-900">Email Notifications</h3>
                    <p className="text-sm text-slate-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-medium text-slate-900">SMS Notifications</h3>
                    <p className="text-sm text-slate-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-medium text-slate-900">Payment Reminders</h3>
                    <p className="text-sm text-slate-600">Get reminded about due payments and invoices</p>
                  </div>
                  <Switch
                    checked={settings.reminderNotifications}
                    onCheckedChange={(checked) => handleInputChange('reminderNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <p className="text-sm text-blue-700">Manage your account security and privacy settings</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-medium text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.twoFactorAuth ? "default" : "secondary"}>
                      {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-slate-900">Session Timeout</h3>
                      <p className="text-sm text-slate-600">Auto-logout after inactivity (minutes)</p>
                    </div>
                  </div>
                  <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => handleInputChange('sessionTimeout', Number(value))}>
                    <SelectTrigger className="bg-white border-blue-200 hover:border-blue-300 w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">Data Management</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Building2, Phone, User, ArrowRight, Mail, UserCheck } from "lucide-react"

interface UserData {
  _id: string
  name: string
  email: string
  displayName: string
  photoURL: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    role: "",
    company: ""
  })

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user")
    const needsOnboarding = localStorage.getItem("needsOnboarding")
    
    if (!storedUser || needsOnboarding !== "true") {
      // Redirect to login if no user data or doesn't need onboarding
      router.push("/auth/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      
      // Pre-fill form with existing data
      setFormData({
        username: userData.username || userData.displayName || userData.name || "",
        phone: userData.phone || "",
        role: userData.role || "",
        company: userData.company || userData.businessName || userData.displayName || ""
      })
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/auth/login")
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.phone || !formData.role || !formData.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch("http://localhost:5000/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          phone: formData.phone,
          role: formData.role,
          company: formData.company
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to complete profile")
      }

      // Update user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.removeItem("needsOnboarding") // Clear onboarding flag
      localStorage.setItem("showWelcome", "true") // Set welcome message

      toast({
        title: "Profile Completed! 🎉",
        description: "Welcome to TaxPro! Your account is now ready.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
      
    } catch (error) {
      console.error("Profile completion error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="bg-white border-blue-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName} 
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Complete Your Profile
            </CardTitle>
            <p className="text-blue-600">
              Hi {user.displayName || user.name}! Let's complete your profile to get started.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pre-filled Name and Email (Read-only) */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3 text-sm text-blue-800">
                  <User className="h-4 w-4" />
                  <span className="font-medium">From Google:</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs text-blue-600">Full Name</Label>
                    <p className="text-sm font-medium text-blue-900">{user.displayName || user.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-blue-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </Label>
                    <p className="text-sm font-medium text-blue-900">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-blue-900 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-blue-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  I am a *
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Business Owner / Individual</SelectItem>
                    <SelectItem value="ca">Chartered Accountant (CA)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-blue-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company / Business Name *
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Enter your company or business name"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By completing your profile, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
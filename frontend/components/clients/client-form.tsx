"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, User, FileText } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext";

interface ClientFormData {
  businessName: string;
  businessType: string;
  gstin: string;
  pan: string;
  address: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  services: string[];
  billingCycle: string;
  retainerAmount: string;
}

interface ClientFormProps {
  onSubmit?: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
  isEditing?: boolean;
}

export function ClientForm({ onSubmit, initialData, isEditing = false }: ClientFormProps) {
  const { user, token } = useAuth();
  
  // Form state with useState
  const [formData, setFormData] = useState<ClientFormData>({
    businessName: initialData?.businessName || "",
    businessType: initialData?.businessType || "",
    gstin: initialData?.gstin || "",
    pan: initialData?.pan || "",
    address: initialData?.address || "",
    contactPerson: initialData?.contactPerson || "",
    designation: initialData?.designation || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    services: initialData?.services || [],
    billingCycle: initialData?.billingCycle || "",
    retainerAmount: initialData?.retainerAmount || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useRef for form and input references
  const formRef = useRef<HTMLFormElement>(null);
  const businessNameRef = useRef<HTMLInputElement>(null);

  // useEffect to focus on business name field when component mounts
  useEffect(() => {
    if (businessNameRef.current) {
      businessNameRef.current.focus();
    }
  }, []);

  // Clear error when user types
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [formData, error]);

  // useCallback for memoized event handlers
  const handleInputChange = useCallback((field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleServiceToggle = useCallback((service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = isEditing ? '/api/clients/update' : '/api/clients/create';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          isDraft,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save client');
      }

      console.log(isDraft ? 'Client saved as draft' : 'Client created successfully');
      
      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form if creating new client (not editing)
      if (!isEditing) {
        setFormData({
          businessName: "",
          businessType: "",
          gstin: "",
          pan: "",
          address: "",
          contactPerson: "",
          designation: "",
          email: "",
          phone: "",
          services: [],
          billingCycle: "",
          retainerAmount: "",
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      console.error('Client submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditing, token, user?.id, onSubmit]);

  const handleCreateClient = useCallback((e: React.FormEvent) => {
    handleSubmit(e, false);
  }, [handleSubmit]);

  const handleSaveDraft = useCallback((e: React.FormEvent) => {
    handleSubmit(e, true);
  }, [handleSubmit]);

  // useMemo for computed values
  const isFormValid = useMemo(() => {
    return (
      formData.businessName.trim() &&
      formData.businessType &&
      formData.contactPerson.trim() &&
      formData.email.trim() &&
      formData.phone.trim()
    );
  }, [formData]);

  const servicesConfig = useMemo(() => [
    "GST Compliance",
    "Income Tax Filing",
    "TDS Management",
    "Bookkeeping",
    "Payroll Management",
    "Audit Services",
  ], []);

  return (
    <form ref={formRef} onSubmit={handleCreateClient} className="max-w-4xl mx-auto space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

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
              <Input 
                ref={businessNameRef}
                id="businessName" 
                placeholder="Enter business name" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="businessType" className="text-blue-700">Business Type *</Label>
              <Select 
                value={formData.businessType} 
                onValueChange={(value) => handleInputChange('businessType', value)}
                required
              >
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
              <Input 
                id="gstin" 
                placeholder="27AABCS1234C1Z5" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.gstin}
                onChange={(e) => handleInputChange('gstin', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="pan" className="text-blue-700">PAN Number</Label>
              <Input 
                id="pan" 
                placeholder="AABCS1234C" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.pan}
                onChange={(e) => handleInputChange('pan', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-blue-700">Business Address</Label>
            <Textarea 
              id="address" 
              placeholder="Enter complete business address" 
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
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
              <Input 
                id="contactPerson" 
                placeholder="Enter contact person name" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="designation" className="text-blue-700">Designation</Label>
              <Input 
                id="designation" 
                placeholder="e.g., Director, Partner" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-blue-700">Email Address *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="contact@business.com" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-blue-700">Phone Number *</Label>
              <Input 
                id="phone" 
                placeholder="+91 98765 43210" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
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
              {servicesConfig.map((service) => (
                <div key={service} className="flex items-center space-x-2 p-2 bg-blue-50/50 rounded hover:bg-blue-50">
                  <Checkbox 
                    id={service} 
                    className="border-blue-300 text-blue-600"
                    checked={formData.services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
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
              <Select 
                value={formData.billingCycle} 
                onValueChange={(value) => handleInputChange('billingCycle', value)}
              >
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
              <Input 
                id="retainerAmount" 
                placeholder="₹ 0" 
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                value={formData.retainerAmount}
                onChange={(e) => handleInputChange('retainerAmount', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button"
          variant="outline" 
          className="border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? "Creating..." : isEditing ? "Update Client" : "Create Client"}
        </Button>
      </div>
    </form>
  )
}

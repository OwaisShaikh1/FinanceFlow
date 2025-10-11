"use client";

import { Suspense, lazy, useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, TrendingUp, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

// Import the combined tax calculator
const CombinedTaxCalculator = lazy(() => 
  import("@/components/tax/combined-tax-calculator")
);

// Enhanced loading skeleton component
const CalculatorSkeleton = () => (
  <Card className="animate-pulse shadow-sm border-0 bg-gradient-to-br from-white to-blue-50">
    <CardHeader className="pb-4 border-b border-blue-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-5 bg-blue-200 rounded w-40"></div>
          <div className="h-3 bg-blue-200 rounded w-32"></div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-blue-200 rounded w-20"></div>
              <div className="h-10 bg-blue-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-20 bg-blue-200 rounded"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-blue-200 rounded"></div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function TaxDashboardPage() {
  const [advanceTaxData, setAdvanceTaxData] = useState({});
  const [taxSavingData, setTaxSavingData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Tax Dashboard rendered in ${endTime - startTime} milliseconds`);
    };
  }, []);

  // Memoized tax summary stats with better visual hierarchy
  const taxStats = useMemo(() => [
    {
      title: "Current FY Tax Liability",
      value: "₹2,45,000",
      change: "+12.5% from last year",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Advance Tax Paid",
      value: "₹1,85,000",
      change: "75% of liability",
      icon: CheckCircle,
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Remaining Tax Due",
      value: "₹60,000",
      change: "Due by 15th March",
      icon: AlertTriangle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Tax Savings Used",
      value: "₹1,50,000",
      change: "Under 80C, 80D",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ], []);

  // Optimized save handler with debouncing
  const handleSaveData = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const payload = {
      ...advanceTaxData,
      ...taxSavingData,
      timestamp: new Date().toISOString(),
      financialYear: "2024-25"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/save-tax-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Tax data saved successfully!",
        });
      } else {
        throw new Error("Failed to save tax data");
      }
    } catch (error) {
      console.error("Error saving tax data:", error);
      toast({
        title: "Error",
        description: "Failed to save tax data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [advanceTaxData, taxSavingData, isLoading]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tax Management Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Comprehensive tax planning, advance payment calculations, and investment optimization for maximum savings
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm font-medium bg-white">
                Financial Year: 2024-25
              </Badge>
              <Badge variant="secondary" className="text-sm font-medium">
                Assessment Year: 2025-26
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button 
              onClick={handleSaveData} 
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Tax Stats Overview with better cards 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {taxStats.map((stat, index) => (
          <Card key={index} className={`relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${stat.borderColor} bg-gradient-to-br from-white to-blue-50`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${stat.color} flex items-center gap-1`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bgColor} ring-1 ring-white/20`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>*/}

      {/* Enhanced Tabbed Interface */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-blue-100">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-blue-100 px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-blue-50 p-1 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-900"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="advance-tax"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-900"
              >
                Advance Tax
              </TabsTrigger>
              <TabsTrigger 
                value="tax-saving"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-900"
              >
                Tax Saving
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="max-w-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Complete Tax Calculator</h3>
                  <p className="text-gray-600">Calculate taxes, plan investments, and manage advance tax payments - all in one place</p>
                </div>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <CombinedTaxCalculator />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="advance-tax" className="mt-0">
              <div className="max-w-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Advance Tax Calculator</h3>
                  <p className="text-gray-600">Calculate your quarterly advance tax payments based on estimated income</p>
                </div>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <CombinedTaxCalculator />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="tax-saving" className="mt-0">
              <div className="max-w-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tax Saving Calculator</h3>
                  <p className="text-gray-600">Optimize your investments across various tax-saving sections to minimize tax liability</p>
                </div>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <CombinedTaxCalculator />
                </Suspense>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
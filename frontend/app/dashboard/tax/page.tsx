"use client";

import { Suspense, lazy, useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, TrendingUp, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

// Lazy load heavy components
const AdvanceTaxCalculator = lazy(() => 
  import("@/components/tax/advance-tax-calculator").then(m => ({ default: m.AdvanceTaxCalculator }))
);
const TaxSavingCalculator = lazy(() => 
  import("@/components/tax/tax-saving-calculator").then(m => ({ default: m.TaxSavingCalculator }))
);

// Loading skeleton component
const CalculatorSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
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

  // Memoized tax summary stats
  const taxStats = useMemo(() => [
    {
      title: "Current FY Tax Liability",
      value: "₹2,45,000",
      change: "+12.5% from last year",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Advance Tax Paid",
      value: "₹1,85,000",
      change: "75% of liability",
      icon: CheckCircle,
      color: "text-blue-600", 
      bgColor: "bg-blue-50"
    },
    {
      title: "Remaining Tax Due",
      value: "₹60,000",
      change: "Due by 15th March",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Tax Savings Used",
      value: "₹1,50,000",
      change: "Under 80C, 80D",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tax Management</h1>
          <p className="text-muted-foreground">Plan your taxes, calculate advance payments, and optimize savings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button 
            onClick={handleSaveData} 
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Financial Year Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm">
          Financial Year: 2024-25
        </Badge>
        <Badge variant="secondary" className="text-sm">
          Assessment Year: 2025-26
        </Badge>
      </div>

      {/* Tax Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {taxStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className={`text-xs ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="advance-tax">Advance Tax</TabsTrigger>
          <TabsTrigger value="tax-saving">Tax Saving</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<CalculatorSkeleton />}>
              <AdvanceTaxCalculator />
            </Suspense>
            <Suspense fallback={<CalculatorSkeleton />}>
              <TaxSavingCalculator />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="advance-tax">
          <Suspense fallback={<CalculatorSkeleton />}>
            <AdvanceTaxCalculator />
          </Suspense>
        </TabsContent>

        <TabsContent value="tax-saving">
          <Suspense fallback={<CalculatorSkeleton />}>
            <TaxSavingCalculator />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
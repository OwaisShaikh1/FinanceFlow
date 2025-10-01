import { AdvanceTaxCalculator } from "@/components/tax/advance-tax-calculator";
import { TaxSavingCalculator } from "@/components/tax/tax-saving-calculator";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import { useState } from "react";

export default function TaxDashboardPage() {
  const [advanceTaxData, setAdvanceTaxData] = useState({});
  const [taxSavingData, setTaxSavingData] = useState({});

  const handleSaveData = async () => {
    const payload = {
      ...advanceTaxData,
      ...taxSavingData,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/save-tax-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Tax data saved successfully!");
      } else {
        alert("Failed to save tax data.");
      }
    } catch (error) {
      console.error("Error saving tax data:", error);
      alert("An error occurred while saving tax data.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tax Dashboard</h1>
      <p className="text-muted-foreground">Manage your tax calculations and savings</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvanceTaxCalculator />
        <TaxSavingCalculator />
      </div>

      <Button className="w-full mt-4" onClick={handleSaveData}>
        Save Tax Data
      </Button>
    </div>
  );
}
import React from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { PageWrapper, distributionData, COLORS } from "./ui/dummy";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export const FinancialReports = () => (
  <PageWrapper
    icon={<PieChartIcon size={24} color="#4f46e5" />}
    title="Financial Reports"
    description="Comprehensive P&L, Balance Sheet, Cash Flow, and Trial Balance reports."
  >
    {/* Fixed height for the chart container */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={distributionData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

import React from "react";
import { Briefcase } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageWrapper } from "./ui/dummy";

export const TaxManagement = () => (
  <PageWrapper
    icon={<Briefcase size={24} color="#4f46e5" />}
    title="Tax Management"
    description="GST filing assistant, TDS calculator, and income tax estimation tools."
  >
    {/* Fixed height for the chart container */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[{ name: "Taxes", GST: 400, TDS: 300, IT: 500 }]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="GST" fill="#4f46e5" />
          <Bar dataKey="TDS" fill="#10b981" />
          <Bar dataKey="IT" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

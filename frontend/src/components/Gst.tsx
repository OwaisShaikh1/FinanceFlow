import React from "react";
import { FileText } from "lucide-react";
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
import { PageWrapper, monthlyData } from "./ui/dummy";

export const GstInvoicing = () => (
  <PageWrapper
    icon={<FileText size={24} color="#4f46e5" />}
    title="GST-Compliant Invoicing"
    description="Generate professional invoices with automatic GST calculations and e-way bill support."
  >
    {/* Fixed height for the chart container */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="invoices" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

import React from "react";
import { Award } from "lucide-react";
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

export const ExpertSupport = () => (
  <PageWrapper
    icon={<Award size={24} color="#4f46e5" />}
    title="Expert Support"
    description="Get help from qualified CAs and accounting professionals whenever needed."
  >
    {/* Fixed height for chart container */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[{ name: "Tickets", General: 40, Tax: 30, Audit: 20 }]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="General" fill="#4f46e5" />
          <Bar dataKey="Tax" fill="#10b981" />
          <Bar dataKey="Audit" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

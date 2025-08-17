import React from "react";
import { Users } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { PageWrapper } from "./ui/dummy";

export const ClientManagement = () => (
  <PageWrapper
    icon={<Users size={24} color="#4f46e5" />}
    title="Client Management"
    description="CAs can manage multiple businesses with secure document sharing and collaboration."
  >
    {/* Use inline style for fixed height */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: "Retail", value: 400 },
              { name: "IT", value: 300 },
              { name: "Manufacturing", value: 300 },
            ]}
            cx="50%"
            cy="50%"
            label
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            <Cell fill="#4f46e5" />
            <Cell fill="#10b981" />
            <Cell fill="#f43f5e" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

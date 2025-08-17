import React from "react";
import { Shield } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PageWrapper } from "./ui/dummy";

export const Compliance = () => (
  <PageWrapper
    icon={<Shield size={24} color="#4f46e5" />}
    title="100% Compliant"
    description="All features are designed to meet Indian tax and accounting regulations."
  >
    {/* Fixed height for ResponsiveContainer */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: "Completed", value: 80 },
              { name: "Pending", value: 20 },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            <Cell fill="#10b981" />
            <Cell fill="#f43f5e" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

import React from "react";
import { Layers } from "lucide-react";
import {
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { PageWrapper } from "./ui/dummy";

export const ChartOfAccounts = () => (
  <PageWrapper
    icon={<Layers size={24} color="#4f46e5" />}
    title="Chart of Accounts"
    description="Manage assets, liabilities, income, and expenses with detailed journal entries."
  >
    {/* Replace Tailwind with plain style */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[
            {
              name: "Accounts",
              Assets: 4000,
              Liabilities: 2400,
              Equity: 2000,
              Expenses: 3000,
            },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Assets" fill="#4f46e5" />
          <Bar dataKey="Liabilities" fill="#f43f5e" />
          <Bar dataKey="Equity" fill="#10b981" />
          <Bar dataKey="Expenses" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

import React from "react";
import { BookOpen } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { PageWrapper, monthlyData } from "./ui/dummy";

// Fixed Income & Expense Tracking page
export const IncomeExpense = () => (
  <PageWrapper
    icon={<BookOpen size={24} color="#4f46e5" />}
    title="Income & Expense Tracking"
    description="Automated transaction categorization with receipt attachment and bank reconciliation."
  >
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

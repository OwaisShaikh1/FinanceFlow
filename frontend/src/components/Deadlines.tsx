import React from "react";
import { Clock } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageWrapper } from "./ui/dummy";

export const Deadlines = () => (
  <PageWrapper
    icon={<Clock size={24} color="#4f46e5" />}
    title="Never Miss Deadlines"
    description="Automated reminders for GST filing, tax payments, and compliance dates."
  >
    {/* Fixed height for the chart container */}
    <div style={{ height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[
            { name: "Jan", reminders: 10, completed: 8 },
            { name: "Feb", reminders: 12, completed: 11 },
            { name: "Mar", reminders: 15, completed: 13 },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="reminders" stroke="#4f46e5" />
          <Line type="monotone" dataKey="completed" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);

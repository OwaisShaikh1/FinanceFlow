import { Briefcase, PieChartIcon, Repeat } from 'lucide-react';
import {PageWrapper, distributionData, COLORS, monthlyData} from './ui/dummy';
import { CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, Legend, Bar, LineChart, Line } from 'recharts';

export const BankReconciliation = () => (
  <PageWrapper
    icon={<Repeat size={24} color="#4f46e5" />}
    title="Bank Reconciliation"
    description="Automated matching of bank transactions with recorded data and CSV imports."
  >
    <div style={{ height: "320px" }}> {/* instead of className="h-80" */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[
            { name: "Jan", matched: 30, unmatched: 5 },
            { name: "Feb", matched: 40, unmatched: 2 },
            { name: "Mar", matched: 35, unmatched: 3 },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="matched" stroke="#4f46e5" />
          <Line type="monotone" dataKey="unmatched" stroke="#f43f5e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </PageWrapper>
);


import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import {
  BookOpen,
  FileText,
  PieChart as PieChartIcon,
  Briefcase,
  Users,
  Layers,
  Repeat,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Dummy data
export const monthlyData = [
  { name: "Jan", income: 4000, expense: 2400, invoices: 30 },
  { name: "Feb", income: 3000, expense: 1398, invoices: 45 },
  { name: "Mar", income: 5000, expense: 2800, invoices: 50 },
];

export const distributionData = [
  { name: "Profit", value: 4000 },
  { name: "Expenses", value: 3000 },
  { name: "Liabilities", value: 2000 },
];

export const COLORS = ["#4f46e5", "#f43f5e", "#10b981"];




export const PageWrapper = ({ icon, title, description, children }: any) => (
  <div
    style={{
      position: "fixed",      // cover the entire screen
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent dark overlay
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "16px",
    }}
  >
    <div
      style={{
        maxWidth: "900px",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.95)", // semi-transparent white card
        borderRadius: "16px",
        boxShadow: "0 12px 36px rgba(0,0,0,0.2)",
        overflow: "hidden",
        backdropFilter: "blur(8px)", // optional: soft blur for background
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "rgba(249, 250, 251, 0.8)",
        }}
      >
        {icon && <div style={{ fontSize: "24px", color: "#4f46e5" }}>{icon}</div>}
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
          {title}
        </h2>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px" }}>
        {description && (
          <p
            style={{
              marginBottom: "24px",
              fontSize: "1rem",
              color: "#4b5563",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  </div>
);



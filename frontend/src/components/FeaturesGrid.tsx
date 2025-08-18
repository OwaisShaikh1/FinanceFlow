import React from "react";
import { 
  BarChart2, BookOpen, FileText, PieChart, Briefcase, Users, Layers, Repeat, Shield, Clock, Award 
} from "lucide-react";
import "../css/FeaturesGrid.css";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: <BarChart2 />, title: "Smart Dashboard", tag: "Dashboard", description: "Real-time overview of income, expenses, and financial health with intelligent insights.", route: "/dashboard" },
  { icon: <BookOpen />, title: "Income & Expense Tracking", tag: "Accounting", description: "Automated transaction categorization with receipt attachment and bank reconciliation.", route: "/income" },
  { icon: <Layers />, title: "Chart of Accounts", tag: "Accounting", description: "Manage assets, liabilities, income, and expenses with detailed journal entries.", route: "/accounts" },
  { icon: <Repeat />, title: "Bank Reconciliation", tag: "Accounting", description: "Automated matching of bank transactions with recorded data and CSV imports.", route: "/bank" },
  { icon: <FileText />, title: "GST-Compliant Invoicing", tag: "Billing", description: "Generate professional invoices with automatic GST calculations and e-way bill support.", route: "/gst" },
  { icon: <Briefcase />, title: "Tax Management", tag: "Tax & Compliance", description: "GST filing assistant, TDS calculator, and income tax estimation tools.", route: "/tax-compliance" },
  { icon: <PieChart />, title: "Financial Reports", tag: "Reporting", description: "Comprehensive P&L, Balance Sheet, Cash Flow, and Trial Balance reports.", route: "/financial-reports" },
  { icon: <Users />, title: "Client Management", tag: "Client Management", description: "CAs can manage multiple businesses with secure document sharing and collaboration.", route: "/client-management" },
  { icon: <Shield />, title: "100% Compliant", description: "All features are designed to meet Indian tax and accounting regulations.", route: "/compliance" },
  { icon: <Clock />, title: "Never Miss Deadlines", description: "Automated reminders for GST filing, tax payments, and compliance dates.", route: "/deadlines" },
  { icon: <Award />, title: "Expert Support", description: "Get help from qualified CAs and accounting professionals whenever needed.", route: "/expert-support" }
];

const FeaturesGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="features-container">
      <div className="features-header">
        <h2>Complete Suite of CA Tools</h2>
        <p>Everything you need to manage accounting, compliance, and client relationships in one powerful platform.</p>
      </div>

      <div className="features-grid">
        {features.slice(0, 8).map((feature, i) => (
          <div
            key={i}
            className="feature-card"
            onClick={() => feature.route && navigate(feature.route)}
            style={feature.route ? { cursor: "pointer" } : undefined}
          >
            <div className="icon-bg">{feature.icon}</div>
            <h3>{feature.title}</h3>
            {feature.tag && <span className="feature-tag">{feature.tag}</span>}
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="features-grid-bottom">
        {features.slice(8).map((feature, i) => (
          <div
            key={i}
            className="feature-card-bottom"
            onClick={() => feature.route && navigate(feature.route)}
            style={feature.route ? { cursor: "pointer" } : undefined}
          >
            <div className="icon-bg-alt">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;

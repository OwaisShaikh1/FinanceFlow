import React, { useState } from "react";
import { FaTachometerAlt, FaUser, FaBook, FaFileInvoiceDollar, FaChartLine, FaFileAlt, FaCalculator, FaUsers } from "react-icons/fa";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path?: string; // optional path for main item
  subItems?: { title: string; path: string }[]; // subitems with paths
}

const sidebarData: SidebarItem[] = [
  { 
    title: "Dashboard", 
    icon: <FaTachometerAlt />, 
    path: "/dashboard",
    subItems: [
      { title: "Total income & expenses", path: "/dashboard/income-expense" },
      { title: "Upcoming tax/GST deadlines", path: "/dashboard/tax-deadlines" },
      { title: "Outstanding invoices", path: "/dashboard/invoices" },
      { title: "Quick snapshot of account health", path: "/dashboard/account-health" }
    ] 
  },
  { 
    title: "User Registration & Login", 
    icon: <FaUser />, 
    path: "/users",
    subItems: [
      { title: "Email & password or phone OTP", path: "/users/email-login" },
      { title: "Role-based access", path: "/users/roles" },
      { title: "Secure login (JWT or OAuth)", path: "/users/auth" }
    ]
  },
  { 
    title: "Accounting & Bookkeeping", 
    icon: <FaBook />, 
    path: "/accounting",
    subItems: [
      { title: "Income & Expense Tracker", path: "/accounting/income-expense" },
      { title: "Chart of Accounts", path: "/accounting/accounts" },
      { title: "Bank Reconciliation", path: "/accounting/bank" }
    ] 
  },
  { title: "Billing & Invoicing", icon: <FaFileInvoiceDollar />, path: "/billing", subItems: [
      { title: "GST-Compliant Invoicing", path: "/billing/gst-invoice" },
      { title: "Recurring Invoices", path: "/billing/recurring" }
    ]
  },
  { title: "Reporting", icon: <FaChartLine />, path: "/reporting", subItems: [
      { title: "Financial Reports", path: "/reporting/financial" },
      { title: "Tax Summary Reports", path: "/reporting/tax-summary" }
    ]
  },
  { title: "Tax & Compliance", icon: <FaCalculator />, path: "/tax", subItems: [
      { title: "GST Filing Assistant", path: "/tax/gst-filing" },
      { title: "TDS Calculator & Filing", path: "/tax/tds" },
      { title: "Income Tax Estimation", path: "/tax/income-tax" }
    ]
  },
  { title: "Client Management", icon: <FaUsers />, path: "/clients", subItems: [
      { title: "Client Management Module", path: "/clients/manage" }
    ]
  },
];


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleExpand = (index: number) => setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div 
        className="collapse-btn" style={{ width: 'fit-content' }}
        onClick={toggleCollapse}
      >
        <span className="icon">{collapsed ? "☰" : "⟨"}</span>
      </div>
      <ul className="sidebar-list">
        {sidebarData.map((item, index) => (
          <li key={index}>
            <div 
              className="sidebar-item" 
              onClick={() => item.path ? navigate(item.path) : toggleExpand(index)}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span className="title">{item.title}</span>}
            </div>

            {item.subItems && expandedIndex === index && !collapsed && (
              <ul className="subitem-list">
                {item.subItems.map((sub, subIndex) => (
                  <li key={subIndex} className="subitem" onClick={() => navigate(sub.path)}>
                    {sub.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

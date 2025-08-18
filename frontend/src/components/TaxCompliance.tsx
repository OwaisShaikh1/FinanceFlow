import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../css/Accounting.module.css";
import GstFilingTab from "./features/GstFilingTab";
import TdsCalculatorTab from "./features/TdsCalculatorTab";
import IncomeTaxTab from "./features/IncomeTaxTab";

interface TaxComplianceProps {
  defaultTab?: "gst" | "tds" | "income-tax";
}

const TaxCompliance: React.FC<TaxComplianceProps> = ({ defaultTab = "gst" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"gst" | "tds" | "income-tax">(defaultTab);

  // Update activeTab when defaultTab prop changes (e.g., navigating via route)
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle tab click: update state AND URL
  const handleTabClick = (tab: "gst" | "tds" | "income-tax") => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Tax Compliance</h1>
      <p className={styles.subtitle}>Manage GST, TDS, and Income Tax in one place</p>

      <div className={styles.card} style={{ width: "100%" }}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <div
            className={`${styles.tab} ${activeTab === "gst" ? styles.active : ""}`}
            onClick={() => handleTabClick("gst")}
          >
            GST Filing
          </div>
          <div
            className={`${styles.tab} ${activeTab === "tds" ? styles.active : ""}`}
            onClick={() => handleTabClick("tds")}
          >
            TDS Calculator
          </div>
          <div
            className={`${styles.tab} ${activeTab === "income-tax" ? styles.active : ""}`}
            onClick={() => handleTabClick("income-tax")}
          >
            Income Tax
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "gst" && (
          <>
            <h2 className={styles.sectionTitle}>GST Filing</h2>
            <p className={styles.sectionSubtitle}>Easily calculate and file GST returns</p>
            <GstFilingTab />
          </>
        )}

        {activeTab === "tds" && (
          <>
            <h2 className={styles.sectionTitle}>TDS Calculator</h2>
            <p className={styles.sectionSubtitle}>Calculate tax deducted at source quickly</p>
            <TdsCalculatorTab />
          </>
        )}

        {activeTab === "income-tax" && (
          <>
            <h2 className={styles.sectionTitle}>Income Tax</h2>
            <p className={styles.sectionSubtitle}>Manage and estimate your income tax liability</p>
            <IncomeTaxTab />
          </>
        )}
      </div>
    </div>
  );
};

export default TaxCompliance;

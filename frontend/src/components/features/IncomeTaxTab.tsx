import React from "react";
import styles from "../../css/Accounting.module.css";

const IncomeTaxTab = () => {
  return (
     <>
        <div className={styles.grid} style={{ width: '100%' }}>
          {/* 2x2 Summary Grid */}
          <div className={styles.grid}>
            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Annual Income</h4>
              <p className={styles.highlightValue}>₹18,00,000</p>
              <p className={styles.sectionSubtitle}>FY 2023-24</p>
            </div>
            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Tax Liability</h4>
              <p className={styles.highlightValue}>₹1,37,500</p>
              <p className={styles.sectionSubtitle}>Before deductions</p>
            </div>
            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Advance Tax Due</h4>
              <p className={styles.highlightValue}>₹34,375</p>
              <p className={styles.sectionSubtitle}>Due Jan 15, 2024</p>
            </div>
            <div className={styles.card}>
              <h4 className={styles.sectionTitle}>Refund / Tax Due</h4>
              <p className={styles.sectionSubtitle}>Latest AY Status Below</p>
            </div>
          </div>
          {/* Tax Calculation Section */}
          <div className={styles.card}>
            <h4 className={styles.sectionTitle}>Tax Calculation</h4>
            <div className={styles.formGroup}>
              <p>Gross Income <span className={styles.highlightValue}>₹18,00,000</span></p>
              <p>Standard Deduction <span>-₹50,000</span></p>
              <p>Section 80C <span>-₹1,50,000</span></p>
              <p>Other Deductions <span>-₹25,000</span></p>
              <p className={styles.sectionSubtitle}>Taxable Income: ₹15,75,000</p>
              <p className={styles.highlightValue}>Tax Liability: ₹1,37,500</p>
            </div>
          </div>
        </div>
      

      {/* Tax Saving Suggestions */}
      <div className={styles.card}>
        <h4 className={styles.sectionTitle}>Tax Saving Suggestions</h4>
        <div className={styles.formGroup}>
          <p className={styles.sectionSubtitle}>Explore ways to reduce liability:
            
          </p>
          <p>Section 80C: Invest in PPF/ELSS/LIC</p>
          <p>Section 80D: Health insurance premium up to ₹25,000</p>
          <p>NPS (80CCD1B): Additional ₹50,000 deduction available</p>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.secondaryBtn}>View Detailed Tax Plan</button>
        </div>
      </div>

      {/* ITR Filing Status */}
        <div className={styles.card}>
          <h4 className={styles.sectionTitle}>ITR Filing Status</h4>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Assessment Year</th>
                  <th>ITR Form</th>
                <th>Filing Date</th>
                <th>Status</th>
                <th>Refund / Tax Due</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AY 2024-25</td>
                <td>ITR-1</td>
                <td>-</td>
                <td>Pending</td>
                <td>-</td>
              </tr>
              <tr>
                <td>AY 2023-24</td>
                <td>ITR-1</td>
                <td>Jul 25, 2023</td>
                <td>Filed</td>
                <td>₹15,000 Refund</td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </>

  );
};

export default IncomeTaxTab;

import React from "react";
import styles from "../../css/Accounting.module.css";

const TdsCalculatorTab = () => {
  return (
    <>
      <div className={styles.grid}>
        {/* 2x2 Summary Grid */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <h4 className={styles.sectionTitle}>Total TDS Deducted</h4>
            <p className={styles.highlightValue}>₹45,000</p>
          </div>
          <div className={styles.card}>
            <h4 className={styles.sectionTitle}>Total TDS Deposited</h4>
            <p className={styles.highlightValue}>₹12,000</p>
          </div>
          <div className={styles.card}>
            <h4 className={styles.sectionTitle}>Pending Liability</h4>
            <p className={styles.highlightValue}>₹33,000</p>
          </div>
          <div className={styles.card}>
            <h4 className={styles.sectionTitle}>Next Due Date</h4>
            <p className={styles.sectionSubtitle}>7th Sept 2024</p>
          </div>
        </div>

        {/* TDS Calculator Section */}
        <div className={styles.form}>
          <h4 className={styles.sectionTitle}>TDS Calculator</h4>
          <div className={styles.formGroup}>
            <label>Payment Type</label>
            <select className={styles.input}>
              <option value="">Select payment type</option>
              <option value="salary">Salary (192)</option>
              <option value="professional">Professional (194J)</option>
              <option value="contractor">Contractor (194C)</option>
              <option value="rent">Rent (194I)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Payment Amount (₹)</label>
            <input type="number" placeholder="Enter amount" className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label>Payee PAN</label>
            <input placeholder="Enter PAN number" className={styles.input} />
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn}>Calculate TDS</button>
          </div>
        </div>
      </div>

      {/* TDS Transactions Table */}
      <div className={`${styles.card} ${styles.fullWidth}`}>
        <h4 className={styles.sectionTitle}>TDS Transactions</h4>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Payee</th>
                <th>Payment Type</th>
                <th>Amount</th>
                <th>TDS Rate</th>
                <th>TDS Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-01-15</td>
                <td>John Doe (ABCPD1234E)</td>
                <td>Professional Services</td>
                <td>₹50,000</td>
                <td>10%</td>
                <td>₹5,000</td>
                <td>Deposited</td>
              </tr>
              <tr>
                <td>2024-01-10</td>
                <td>ABC Contractors (DEFGH5678I)</td>
                <td>Contractor Payment</td>
                <td>₹1,00,000</td>
                <td>2%</td>
                <td>₹2,000</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TdsCalculatorTab;

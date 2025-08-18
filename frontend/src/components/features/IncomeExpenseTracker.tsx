import React from "react";
import styles from "../../css/Accounting.module.css";

const IncomeExpenseTracker = () => {
  return (
    <div className={styles.formGrid}>
      {/* Add Transaction Section */}
      <div>
        <h2 className={styles.sectionTitle}>Add Transaction</h2>
        <p className={styles.sectionSubtitle}>Record income or expense manually</p>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Transaction Type</label>
            <select className={styles.input} defaultValue="">
              <option value="" disabled>Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Amount (₹)</label>
            <input type="number" placeholder="0.00" className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select className={styles.input} defaultValue="">
              <option value="" disabled>Select category</option>
              <option value="Sales Revenue">Sales Revenue</option>
              <option value="Rent">Rent</option>
              <option value="Salaries">Salaries</option>
              <option value="Utilities">Utilities</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Date</label>
            <input type="text" placeholder="dd-mm-yyyy" className={styles.input} />
          </div>
          <div className={styles.formGroupFull}>
            <label>Description</label>
            <input type="text" placeholder="Transaction description" className={styles.input} />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn}>+ Add Transaction</button>
          <button className={styles.secondaryBtn}>Attach Receipt</button>
        </div>
      </div>

      {/* Upload Bank Statement Section */}
      <div className={styles.uploadCard}>
        <h2 className={styles.sectionTitle}>Upload Bank Statement</h2>
        <p className={styles.sectionSubtitle}>Auto-import transactions from CSV</p>
        <div className={styles.dropArea}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.uploadIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p>Drop your CSV file here or click to browse</p>
          <button className={styles.chooseFileBtn}>Choose File</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseTracker;

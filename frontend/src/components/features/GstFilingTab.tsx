import React from "react";
import styles from "../../css/Accounting.module.css";

const GstFilingTab = () => {
  return (
    <>
        {/* Left 2x2 Summary Grid */}
        <div className={styles.grid}>
          <div className={styles.card} style={{ maxWidth:'fitcontent' }}>
            <h4 className={styles.sectionTitle}>GSTR-1 Status</h4>
            <p className={styles.sectionSubtitle}>Last filed: July 2024</p>
          </div>
          <div className={styles.card} style={{ maxWidth:'fitcontent' }}>
            <h4 className={styles.sectionTitle}>GSTR-3B Status</h4>
            <p className={styles.sectionSubtitle}>Pending</p>
          </div>
          <div className={styles.card} style={{ maxWidth:'fitcontent' }}>
            <h4 className={styles.sectionTitle}>Tax Liability</h4>
            <p className={styles.highlightValue}>₹50,000</p>
          </div>
          <div className={styles.card} style={{ maxWidth:'fitcontent' }}>
            <h4 className={styles.sectionTitle}>Credit Available</h4>
            <p className={styles.highlightValue}>₹20,000</p>
          </div>
        </div>

        {/* Filing Assistant Section */}
        <div className={styles.uploadCard}>
          <h2 className={styles.sectionTitle}>Filing Assistant</h2>
          <p className={styles.sectionSubtitle}>Auto-import invoices and calculate GST</p>

          <div className={styles.dropArea}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.uploadIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p>Drop your invoices here or click to browse</p>
            <button className={styles.chooseFileBtn}>Choose File</button>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn}>Calculate GST</button>
            <button className={styles.secondaryBtn}>File Return</button>
          </div>
        </div>

      {/* Bottom Section: Filing Calendar full width */}
      <div className={`${styles.card} ${styles.fullWidth}`}>
        <h4 className={styles.sectionTitle}>Filing Calendar</h4>
        <div className={styles.tableWrapper}> 
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Return</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GSTR-1</td>
                <td>11th Aug</td>
                <td>Filed</td>
              </tr>
              <tr>
                <td>GSTR-3B</td>
                <td>20th Aug</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div> 
      </div>
    </>
  );
};

export default GstFilingTab;

import React from 'react';
import styles from '../../css/Accounting.module.css';

const ChartOfAccounts = () => {
  const accounts = [
    { code: 1000, name: 'Cash', type: 'Asset', balance: '₹1,25,000' },
    { code: 1200, name: 'Accounts Receivable', type: 'Asset', balance: '₹85,000' },
    { code: 4000, name: 'Sales Revenue', type: 'Income', balance: '₹12,45,000' },
  ];

  return (
    <div className={styles.card}>
      <button style={{width: '100%'}}>
        + Add Account
      </button>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Account Code</th>
              <th className={styles.th}>Account Name</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Balance</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td className={styles.td}>{account.code}</td>
                <td className={styles.td}>{account.name}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${account.type === 'Asset' ? styles.asset : styles.income}`}>
                    {account.type}
                  </span>
                </td>
                <td className={styles.td}>{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartOfAccounts;

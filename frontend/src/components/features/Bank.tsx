import React from 'react';
import styles from '../../css/Accounting.module.css';

const BankReconciliation = () => {
  const transactions = [
    { date: '2024-01-15', bankTxn: 'Client Payment ABC', bookTxn: 'Client Payment - ABC Corp', amount: '₹50,000', status: 'Matched' },
    { date: '2024-01-12', bankTxn: 'Bank Charges', bookTxn: '-', amount: '₹500', status: 'Unmatched' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bank Reconciliation</h2>
      <p className={styles.subtitle}>Match bank transactions with recorded data</p>

      <div className={styles.balanceContainer}>
        <div className={styles.balanceBox}>
          <p className={styles.balanceLabel}>Bank Balance</p>
          <p className={styles.balanceAmount}>₹3,45,000</p>
        </div>
        <div className={styles.balanceBox}>
          <p className={styles.balanceLabel}>Book Balance</p>
          <p className={styles.balanceAmount}>₹3,40,000</p>
        </div>
        <div className={styles.balanceBox}>
          <p className={styles.balanceLabel}>Difference</p>
          <p className={`${styles.balanceAmount} ${styles.difference}`}>₹5,000</p>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.primaryButton}>Import Bank Statement</button>
        <button className={styles.secondaryButton}>Auto Match</button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Bank Transaction</th>
              <th className={styles.th}>Book Transaction</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className={styles.td}>{transaction.date}</td>
                <td className={styles.td}>{transaction.bankTxn}</td>
                <td className={styles.td}>{transaction.bookTxn}</td>
                <td className={styles.td}>{transaction.amount}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${transaction.status === 'Matched' ? styles.matched : styles.unmatched}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankReconciliation;

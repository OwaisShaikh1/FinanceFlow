import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../css/Accounting.module.css';
import ChartOfAccounts from '../components/features/ChartofAccounts';
import BankReconciliation from '../components/features/Bank';
import IncomeExpenseTracker from '../components/features/IncomeExpenseTracker';
import Sidebar from '../components/layout/sidebar';

interface AccountingProps {
  defaultTab?: 'income-expense' | 'accounts' | 'bank';
}

const Accounting: React.FC<AccountingProps> = ({ defaultTab = 'income-expense' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync with defaultTab prop when navigating via route
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle tab click: update state AND URL
  const handleTabClick = (tab: 'income-expense' | 'accounts' | 'bank') => {
    setActiveTab(tab);
    navigate(`/accounting/${tab}`);
  };

  return (
    <div className={styles.app}>
      
      <h1 className={styles.title}>Accounting & Bookkeeping</h1>
      <p className={styles.subtitle}>Manage your income, expenses, and chart of accounts</p>

      {/* Main content */}
      <div className={styles.card} style={{ flex: 1, padding: '10px' }}>
        {/* Tabs */}
          <div className={styles.tabs}>
            <div
              className={`${styles.tab} ${activeTab === 'income-expense' ? styles.active : ''}`}
              onClick={() => handleTabClick('income-expense')}
            >
              Income & Expense Tracker
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'accounts' ? styles.active : ''}`}
              onClick={() => handleTabClick('accounts')}
            >
              Chart of Accounts
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'bank' ? styles.active : ''}`}
              onClick={() => handleTabClick('bank')}
            >
              Bank Reconciliation
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'income-expense' && <IncomeExpenseTracker />}
          {activeTab === 'accounts' && <ChartOfAccounts />}
          {activeTab === 'bank' && <BankReconciliation />}

          {/* Recent Transactions */}
          {activeTab === 'income-expense' && (
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Recent Transactions</h2>
              <p className={styles.sectionSubtitle}>Latest income and expense entries</p>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: '2024-01-15', description: 'Client Payment - ABC Corp', category: 'Sales Revenue', type: 'Income', amount: '₹50,000' },
                      { date: '2024-01-10', description: 'Office Rent', category: 'Rent', type: 'Expense', amount: '₹25,000' }
                    ].map((tx, idx) => (
                      <tr key={idx}>
                        <td>{tx.date}</td>
                        <td>{tx.description}</td>
                        <td>{tx.category}</td>
                        <td>
                          <span className={`${styles.typeBadge} ${tx.type === 'Income' ? styles.income : styles.expense}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td>{tx.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

  );
};

export default Accounting;

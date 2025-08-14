import React from 'react';
import { TrendingUp, Clock, FileText, Calendar } from 'lucide-react';
import '../css/Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of your business finances</p>
        </div>

        {/* Top-Level Metric Cards */}
        <div className="metric-cards">
          <div className="metric-card">
            <div className="card-header">
              <h3>Total Income</h3>
              <TrendingUp className="icon-green" />
            </div>
            <p className="metric-value">₹12,45,000</p>
            <p className="metric-change">+15% from last month</p>
          </div>

          <div className="metric-card">
            <div className="card-header">
              <h3>GST Due</h3>
              <Clock className="icon-yellow" />
            </div>
            <p className="metric-value">₹2,34,000</p>
            <p className="metric-change-red">Due in 5 days</p>
          </div>

          <div className="metric-card">
            <div className="card-header">
              <h3>Pending Invoices</h3>
              <FileText className="icon-gray" />
            </div>
            <p className="metric-value">7</p>
            <p className="metric-change-gray">₹65,000 pending</p>
          </div>

          <div className="metric-card">
            <div className="card-header">
              <h3>Upcoming Tasks</h3>
              <Calendar className="icon-blue" />
            </div>
            <p className="metric-value">12</p>
            <p className="metric-change-gray">This week</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Recent Transactions */}
          <div className="main-card">
            <h2>Recent Transactions</h2>
            <p>Latest income and expense entries</p>
            <div className="card-divider">
              <div className="transaction-item">
                <div>
                  <p className="transaction-title">Client Payment - ABC Corp</p>
                  <p className="transaction-date">Jan 15, 2024</p>
                </div>
                <p className="transaction-amount income">+₹50,000</p>
              </div>
              <div className="transaction-item">
                <div>
                  <p className="transaction-title">Office Rent</p>
                  <p className="transaction-date">Jan 10, 2024</p>
                </div>
                <p className="transaction-amount expense">-₹25,000</p>
              </div>
              <div className="transaction-item">
                <div>
                  <p className="transaction-title">Software Subscription</p>
                  <p className="transaction-date">Jan 8, 2024</p>
                </div>
                <p className="transaction-amount expense">-₹12,000</p>
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="main-card">
            <h2>Compliance Status</h2>
            <p>Track your tax and regulatory compliance</p>
            <div className="card-divider">
              <div className="compliance-item">
                <p>GST Returns (GSTR-1)</p>
                <span className="status-pending">Pending</span>
              </div>
              <div className="compliance-item">
                <p>TDS Returns</p>
                <span className="status-filed">Filed</span>
              </div>
              <div className="compliance-item">
                <p>Income Tax</p>
                <span className="status-updated">Up to date</span>
              </div>
              <div className="compliance-item">
                <p>Audit Requirements</p>
                <span className="status-na">Not applicable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

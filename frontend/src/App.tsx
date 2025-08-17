import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landingpage from './pages/LandingPage'
import FeaturesGrid from './components/FeaturesGrid';
import Dashboard from './pages/Dashboard';
import SignForm from './pages/SignForm';
import { BankReconciliation } from './components/BankReconciliation';
import { ClientManagement } from './components/ClientManagement';
import { FinancialReports } from './components/FinancialReports';
import { TaxManagement } from './components/TaxManagement';
import { Compliance } from './components/Compliance';
import { ChartOfAccounts } from './components/ChartOfAccounts';
import { Deadlines } from './components/Deadlines';
import { ExpertSupport } from './components/ExpertSupport';
import { GstInvoicing } from './components/Gst';
import { IncomeExpense } from './components/IncomeExpense';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/features" element={<FeaturesGrid />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<SignForm isSignInDefault={true} />} />
        <Route path="/signup" element={<SignForm isSignInDefault={false} />} />
        <Route path="/bank-reconciliation" element={<BankReconciliation />} />
        <Route path="/client-management" element={<ClientManagement />} />
        <Route path="/financial-reports" element={<FinancialReports />} />
        <Route path="/tax-management" element={<TaxManagement />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/expert-support" element={<ExpertSupport />} />
        <Route path="/gst-invoicing" element={<GstInvoicing />} />
        <Route path="/income-expense" element={<IncomeExpense />} />
      </Routes>
    </Router>
  );
}

export default App;

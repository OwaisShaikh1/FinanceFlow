import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landingpage from './pages/LandingPage'
import FeaturesGrid from './components/FeaturesGrid';
import Dashboard from './pages/Dashboard';
import SignForm from './pages/SignForm';
import Accounting from './pages/Accounting';
import TaxCompliance from './pages/TaxCompliance';
import Sidebar from './components/layout/sidebar';
import styles from './App.module.css';



function App() {
  return (
    <div className={styles.flexWrapper}>
      <Router>
        <Sidebar/>
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Landingpage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<SignForm isSignInDefault={true} />} />
            <Route path="/signup" element={<SignForm isSignInDefault={false} />} />

            {/* Accounts Tracking */}
            <Route path="accounting/income-expense" element={<Accounting defaultTab="income-expense" />} />
            <Route path="accounting/accounts" element={<Accounting defaultTab="accounts" />} />
            <Route path="accounting/bank" element={<Accounting defaultTab="bank" />} />

            {/* Tax Compliance */}
            <Route path="tax/gst" element={<TaxCompliance defaultTab="gst" />} />
            <Route path="tax/tds" element={<TaxCompliance defaultTab="tds" />} />
            <Route path="tax/income-tax" element={<TaxCompliance defaultTab="income-tax" />} />

            <Route path="/features" element={<FeaturesGrid />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/tax" element={<TaxCompliance />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

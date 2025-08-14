import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landingpage from './pages/LandingPage'
import FeaturesGrid from './components/FeaturesGrid';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/home" element={<FeaturesGrid />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

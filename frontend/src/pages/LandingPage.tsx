import React from 'react';
import { LogIn, Square, ArrowRight } from 'lucide-react';
import '../css/Landing.css';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <div className="logo">
          <Square className="logo-square" />
          <span>CA Assistant</span>
        </div>

        <nav>
          <a href="/features">Features</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>
            <span>Login</span>
          </button>
          <button className="get-started" onClick={() => navigate('/signup')}>
            <span>Get Started</span>
            <ArrowRight />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Left section: Hero */}
        <div className="hero">
          <h1>
            <span className="highlight">Complete CA Solutions</span>
            <br />
            for Modern Business
          </h1>
          <p>
            Streamline your accounting, tax compliance, and financial management
            with India's most trusted CA Assistant platform.
          </p>

          <div className="hero-buttons">
            <button className="start-trial">
              <span>Start Free Trial</span>
              <ArrowRight />
            </button>
            <button className="learn-more">Learn More</button>
          </div>
        </div>

        {/* Right section: Dashboard */}
        <div className="dashboard-card">
          <h2>Quick Dashboard Preview</h2>

          <div className="card-row">
            <div className="card">
              <h3>Total Income</h3>
              <h3>₹12,45,000</h3>
              <p className="income">+12% this month</p>
            </div>

            <div className="card">
              <h3>GST Due</h3>
              <h3 className="gst-due">₹2,34,000</h3>
              <p className="gst-due">Due in 5 days</p>
            </div>
          </div>

          {/* Compliance */}
          <div className="compliance">
            <h2>Compliance Status</h2>
            <div className="progress-bar">
              <div className="progress-bar-fill"></div>
            </div>
            <span className="progress-text">80% Complete</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

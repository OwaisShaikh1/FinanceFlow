import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '../css/SignForm.css';

interface SignFormProps {
  isSignInDefault?: boolean;
}

const SignForm: React.FC<SignFormProps> = ({ isSignInDefault = false }) => {
  const [isSignIn, setIsSignIn] = useState(isSignInDefault);

  // make sure it updates when navigating between /login and /signup
  useEffect(() => {
    setIsSignIn(isSignInDefault);
  }, [isSignInDefault]);

  return (
    <div className="signform-container">
      <div className="signform-card">
        <div className="arrow left-arrow">
          <ArrowLeft />
        </div>
        <div className="arrow right-arrow">
          <ArrowRight />
        </div>

        <div className="form-header">
          <h1>{isSignIn ? "Welcome Back" : "Create Account"}</h1>
          <p>{isSignIn ? "Sign in to your CA Assistant account" : "Join CA Assistant today"}</p>
        </div>

        <form className="form-inputs">
          {!isSignIn && (
            <div className="input-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" placeholder="Enter your full name" />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder={isSignIn ? "Enter your password" : "Create a password"}
            />
          </div>

          <button type="submit">{isSignIn ? "Sign In" : "Create Account"}</button>
        </form>

        <div className="switch-form">
          <p>
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsSignIn(!isSignIn)}>
              {isSignIn ? " Sign up" : " Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignForm;

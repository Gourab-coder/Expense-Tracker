import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signIn = async () => {
    const url = `${API_BASE_URL}/auth/login`;
    const { email, password } = formData;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Sign-in failed');
    }
    if (data.jwtToken) {
      localStorage.setItem("token", data.jwtToken);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      console.log("✅ Token saved:", data.jwtToken);
    } else {
      console.warn("⚠️ No token returned from backend");
    }
    return data;
  };

  const signUp = async () => {
    const url = `${API_BASE_URL}/auth/signup`;
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Sign-up failed');
    }
    setIsSignIn(true);
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      if (isSignIn) {
        result = await signIn();
      } else {
        result = await signUp();
      }

      console.log('Success:', result);
      // Here you would typically save the token and redirect the user
    //   localStorage.setItem('token', result.token);
    //   localStr
      navigate('/expenses'); // Redirect to the expenses page
      alert(isSignIn ? 'Signed in successfully!' : 'Account created successfully!');

    } catch (error) {
      console.error('Authentication error:', error.message);
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo + Title */}
        <div className="auth-header">
          <div className="auth-logo">📊</div>
          <h1 className="auth-title">ExpenseTracker</h1>
          <p className="auth-subtitle">
            {isSignIn ? 'Welcome back! Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            onClick={() => setIsSignIn(true)}
            className={`tab-button ${isSignIn ? 'active' : ''}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`tab-button ${!isSignIn ? 'active' : ''}`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder={isSignIn ? 'Enter your password' : 'Create a password'}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isSignIn && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {isSignIn && (
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-button">
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!token) navigate('/auth');
  }, [token, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-main">
        <h2>📊 ExpenseTracker</h2>
        <div className="navbar-right" ref={dropdownRef}>
          <button
            className="user-icon"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            P
          </button>

          {isDropdownOpen && (
            <div className="user-dropdown">
              {token ? (
                <>
                  <div className="user-info">
                    <div className="user-name">{name}</div>
                    <div className="user-email">{email}</div>
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <div className="user-info">Loading...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

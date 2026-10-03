import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

const { darkMode, toggleTheme } = useContext(ThemeContext);

  // Logout Function
  const handleLogout = () => {
    // Remove stored authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to Login page
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="logo">
        🩸 <span>Blood Management System</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/blood-stock">Blood Stock</NavLink>

        <NavLink to="/donation-request">
          Donation Request
        </NavLink>

        <NavLink to="/patient-request">
          Patient Request
        </NavLink>

        <NavLink to="/donor-schedule">
          Donor Schedule
        </NavLink>
        <NavLink to="/blood-issue">
  Blood Issue
</NavLink>


<div className="user-info">
  👤 {user?.role}
</div>

<button
  className="theme-btn"
  onClick={toggleTheme}
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

<button
  className="logout-btn"
  onClick={handleLogout}
>
  Logout
</button>
      </nav>
    </header>
  );
}

export default Navbar;
import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaTint,
  FaHandHoldingHeart,
  FaUserInjured,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        <h2>🩸 BloodMS</h2>
      </div>

      <nav>

        <NavLink to="/dashboard">
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink to="/blood-stock">
          <FaTint />
          Blood Stock
        </NavLink>

        <NavLink to="/donation-request">
          <FaHandHoldingHeart />
          Donation
        </NavLink>

        <NavLink to="/patient-request">
          <FaUserInjured />
          Patients
        </NavLink>

        <NavLink to="/donor-schedule">
          <FaCalendarAlt />
          Schedule
        </NavLink>

      </nav>

      <button className="logout-btn">
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;
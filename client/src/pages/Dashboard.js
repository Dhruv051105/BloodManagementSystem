// Import React
// useEffect is used to run code when the component loads
// useState is used to store dashboard statistics
import React, { useEffect, useState } from "react";

// Axios is used to communicate with the backend API
import axios from "axios";

// CSS file used to style the Dashboard
import "./Dashboard.css";


function Dashboard() {

  // Get the JWT token saved in browser LocalStorage during login
  // This token is sent to the backend to prove that the user is logged in
  const token = localStorage.getItem("token");


  // Create state to store all Dashboard statistics
  // Initially, all values are 0
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalBloodStock: 0,
    totalDonationRequests: 0,
    totalPatientRequests: 0,
    totalSchedules: 0,
    totalBloodIssues: 0,
  });


  // useEffect runs when the Dashboard component is loaded
  // The empty [] means it runs once when the component loads
  useEffect(() => {

    // Call the function that gets dashboard data from the backend
    fetchDashboard();

  }, []);


  // This function gets data from all required backend APIs
  const fetchDashboard = async () => {

    try {

      // Create headers for the API requests
      // The JWT token is sent using the Authorization header
      const headers = {
        Authorization: `Bearer ${token}`,
      };


      // Make multiple API requests at the same time
      // Promise.all waits until all requests are completed
      const [
        stockRes,
        donationRes,
        patientRes,
        scheduleRes,
        issueRes,
      ] = await Promise.all([

        // Get blood stock data
        axios.get("http://localhost:5000/api/blood-stock", {
          headers,
        }),

        // Get donation request data
        axios.get("http://localhost:5000/api/donation-requests", {
          headers,
        }),

        // Get patient request data
        axios.get("http://localhost:5000/api/patient-requests", {
          headers,
        }),

        // Get donor schedule data
        axios.get("http://localhost:5000/api/donor-schedule", {
          headers,
        }),

        // Get blood issue data
        axios.get("http://localhost:5000/api/blood-issues", {
          headers,
        }),
      ]);


      // Get the actual blood stock array from the backend response
      const bloodStocks = stockRes.data.bloodStocks;


      // Calculate the total number of blood units
      // reduce() goes through every blood stock record
      // Number(item.units) converts units into a number
      const totalUnits = bloodStocks.reduce(
        (sum, item) => sum + Number(item.units),
        0
      );


      // Update the Dashboard statistics
      setStats({

        // Total number of blood units
        totalUnits,

        // Number of blood stock records
        totalBloodStock: bloodStocks.length,

        // Number of donation request records
        totalDonationRequests: donationRes.data.donationRequests.length,

        // Number of patient request records
        totalPatientRequests: patientRes.data.patientRequests.length,

        // Number of donor schedules
        totalSchedules: scheduleRes.data.donors.length,

        // Number of blood issue records
        totalBloodIssues: issueRes.data.issues.length,
      });


    } catch (error) {

      // If an API request fails, show the error in the browser console
      console.error(error);
    }
  };


  // Display the Dashboard UI
  return (

    <div className="dashboard-container">

      {/* Dashboard heading */}
      <h1>Dashboard</h1>

      {/* Short description of the Dashboard */}
      <p>Blood Management System Overview</p>


      {/* Grid containing all statistic cards */}
      <div className="dashboard-grid">


        {/* Card showing total blood units */}
        <div className="dashboard-card">
          <h3>Total Blood Units</h3>

          {/* Display totalUnits from the stats state */}
          <h2>{stats.totalUnits}</h2>
        </div>


        {/* Card showing number of blood stock records */}
        <div className="dashboard-card">
          <h3>Blood Stock Records</h3>

          {/* Display totalBloodStock from stats */}
          <h2>{stats.totalBloodStock}</h2>
        </div>


        {/* Card showing donation requests */}
        <div className="dashboard-card">
          <h3>Donation Requests</h3>

          {/* Display totalDonationRequests from stats */}
          <h2>{stats.totalDonationRequests}</h2>
        </div>


        {/* Card showing patient requests */}
        <div className="dashboard-card">
          <h3>Patient Requests</h3>

          {/* Display totalPatientRequests from stats */}
          <h2>{stats.totalPatientRequests}</h2>
        </div>


        {/* Card showing donor schedules */}
        <div className="dashboard-card">
          <h3>Donor Schedules</h3>

          {/* Display totalSchedules from stats */}
          <h2>{stats.totalSchedules}</h2>
        </div>


        {/* Card showing blood issued records */}
        <div className="dashboard-card">
          <h3>Blood Issued</h3>

          {/* Display totalBloodIssues from stats */}
          <h2>{stats.totalBloodIssues}</h2>
        </div>


      </div>

    </div>
  );
}


// Export Dashboard component
// This allows App.js to use the Dashboard component
export default Dashboard;
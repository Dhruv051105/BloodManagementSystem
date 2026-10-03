// Import React
// Used to create the React component
import React from "react";

// Import Outlet from React Router
// Outlet is the place where the current child page will be displayed
import { Outlet } from "react-router-dom";

// Import Navbar component
// Navbar contains the common navigation/header of the application
import Navbar from "../components/Navbar";


function MainLayout() {
  return (
    <>

      {/* 
        Display the Navbar at the top of all pages
        that use MainLayout.

        For example:
        Dashboard
        Blood Stock
        Donation Request
        Patient Request
        etc.
      */}
      <Navbar />


      {/* 
        <main> contains the main content area of the application.

        The current child route will be displayed inside
        the <Outlet /> below.
      */}
      <main
        style={{

          // Add 30px space around the main content
          padding: "30px",

          // Set a light background color for the main area
          background: "#f4f6f9",

          // Make the main area at least the full height of the screen
          minHeight: "100vh",
        }}
      >

        {/* 
          Outlet displays the currently selected child page.

          Example:
          /dashboard       → Dashboard
          /blood-stock     → BloodStock
          /blood-issue     → BloodIssue
          /donor-schedule  → DonorSchedule
        */}
        <Outlet />

      </main>

    </>
  );
}


// Export MainLayout so it can be used in App.js
export default MainLayout;
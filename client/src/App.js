// Import React
// React is required to create React components
import React from "react";

// Import React Router components
// BrowserRouter: enables routing in the React application
// Routes: contains all the routes
// Route: defines a particular URL and the component to display
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import the Blood Issue page
import BloodIssue from "./pages/BloodIssue";

// Import ToastContainer
// It displays toast notifications such as success, warning, and error messages
import { ToastContainer } from "react-toastify";


// Import CSS file for the App component
import "./App.css";


// Import all the pages used in the application
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BloodStock from "./pages/BloodStock";
import DonationRequest from "./pages/DonationRequest";
import PatientRequest from "./pages/PatientRequest";
import DonorSchedule from "./pages/DonorSchedule";


// Import layouts
// MainLayout is used for logged-in/protected pages
// AuthLayout is used for Login and Register pages
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Import ProtectedRoute
// It checks whether the user is allowed to access protected pages
import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  // App component returns the complete routing structure
  return (

    // Router enables navigation between different pages
    // without completely refreshing the browser
    <Router>

      {/* Routes contains all the routes of our application */}
      <Routes>


        {/* ==============================
            PUBLIC ROUTES
            ==============================

            These routes are related to authentication.
            Users can access Login/Register without
            entering the protected part of the application.
        */}

        <Route element={<AuthLayout />}>

          {/* "/" displays the Login page */}
          <Route path="/" element={<Login />} />

          {/* "/login" also displays the Login page */}
          <Route path="/login" element={<Login />} />

          {/* "/register" displays the Register page */}
          <Route path="/register" element={<Register />} />

        </Route>


        {/* ==============================
            PROTECTED ROUTES
            ==============================

            These pages are placed inside ProtectedRoute.
            ProtectedRoute checks whether the user is authenticated.

            MainLayout provides the common layout for these pages.
        */}

        <Route
          element={

            // ProtectedRoute controls access to the protected pages
            <ProtectedRoute>

              {/* MainLayout is the common layout
                  for the logged-in part of the application */}
              <MainLayout />

            </ProtectedRoute>
          }
        >

          {/* Dashboard page */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* Blood Stock page */}
          <Route
            path="/blood-stock"
            element={<BloodStock />}
          />


          {/* Donation Request page */}
          <Route
            path="/donation-request"
            element={<DonationRequest />}
          />


          {/* Patient Request page */}
          <Route
            path="/patient-request"
            element={<PatientRequest />}
          />


          {/* Blood Issue page */}
          <Route
            path="/blood-issue"
            element={<BloodIssue />}
          />


          {/* Donor Schedule page */}
          <Route
            path="/donor-schedule"
            element={<DonorSchedule />}
          />

        </Route>

      </Routes>


      {/* ToastContainer is placed outside Routes
          so notifications can appear throughout the application */}

      <ToastContainer

        // Toast messages appear in the top-right corner
        position="top-right"

        // Toast automatically disappears after 3 seconds
        autoClose={3000}

        // Show the progress bar while the toast is displayed
        hideProgressBar={false}

        // Show newest notification at the top
        newestOnTop

        // User can close the toast by clicking it
        closeOnClick

        // Pause the timer when the mouse is over the toast
        pauseOnHover
      />

    </Router>
  );
}


// Export App component
// This allows index.js to import and render App
export default App;
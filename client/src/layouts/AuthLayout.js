// Import React
// Required for creating the React component
import React from "react";

// Outlet is used to display the child route component
import { Outlet } from "react-router-dom";


function AuthLayout() {

  // AuthLayout provides a common layout/container
  // for authentication pages such as Login and Register
  return (
    <div>

      {/* 
        Outlet displays the component of the child route.

        In App.js, AuthLayout contains:
        
        /         → Login
        /login    → Login
        /register → Register

        So the selected child page will appear here.
      */}
      <Outlet />

    </div>
  );
}


// Export AuthLayout so it can be used in App.js
export default AuthLayout;
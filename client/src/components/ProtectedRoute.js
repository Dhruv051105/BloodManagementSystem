// Import React
// Used to create the ProtectedRoute component
import React from "react";

// Import Navigate from React Router
// Navigate is used to redirect the user to another page
import { Navigate } from "react-router-dom";


// ProtectedRoute receives "children"
// Children means the component/page placed inside ProtectedRoute
const ProtectedRoute = ({ children }) => {

  // Get the JWT token from browser LocalStorage
  // The token was saved when the user successfully logged in
  const token = localStorage.getItem("token");


  // Check whether a token exists
  // If there is no token, the user is not considered logged in
  if (!token) {

    // Redirect the user to the Login page
    // "replace" prevents the protected page from remaining
    // in the browser history
    return <Navigate to="/login" replace />;
  }


  // If a token exists, allow the requested page to be displayed
  // "children" is the protected component/page
  return children;
};


// Export ProtectedRoute so it can be used in App.js
export default ProtectedRoute;
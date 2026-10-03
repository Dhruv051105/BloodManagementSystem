// Import React and useState Hook
import React, { useState } from "react";

// Import navigation tools from React Router
// useNavigate is used to move to another page using JavaScript
// Link is used to create a link to another page
import { useNavigate, Link } from "react-router-dom";

// Import Axios to send requests to the backend
import axios from "axios";

// Import toast to show success and error messages
import { toast } from "react-toastify";

// Import CSS file for styling the Login page
import "./Login.css";


// Login component
function Login() {

  // useNavigate allows us to move to another route
  const navigate = useNavigate();


  // Store the email and password entered by the user
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // This function runs whenever the user types in an input field
  function handleChange(e) {

    // Update the changed field while keeping the other field unchanged
    setFormData({
      ...formData,

      // e.target.name tells us which input was changed
      // e.target.value contains the value entered by the user
      [e.target.name]: e.target.value,
    });
  }


  // This function runs when the Login form is submitted
  async function handleSubmit(e) {

    // Prevent the browser from refreshing the page after form submission
    e.preventDefault();

    try {

      // Send email and password to the backend Login API
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );


      // Save the JWT token received from the backend
      // The token will be used for authenticated requests
      localStorage.setItem("token", response.data.token);


      // Save the logged-in user's information in localStorage
      // JSON.stringify converts the user object into a string
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );


      // Show the success message received from the backend
      toast.success(response.data.message);


      // After successful login, go to the Dashboard
      navigate("/dashboard");


    } catch (error) {

      // If login fails, show the backend error message
      // If no backend message exists, show "Login Failed"
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    }
  }


  // Return the Login page UI
  return (
    <div className="login-container">

      {/* Main Login card */}
      <div className="login-card">

        {/* Blood drop icon */}
        <h1>🩸</h1>

        {/* Project title */}
        <h2>Blood Management System</h2>

        {/* Welcome message */}
        <p>Welcome Back</p>


        {/* Login form
            When submitted, handleSubmit() will run */}
        <form onSubmit={handleSubmit}>


          {/* Email input */}
          <input
            type="email"
            placeholder="Email Address"
            name="email"

            // Connect the input value with React state
            value={formData.email}

            // Run handleChange whenever the user types
            onChange={handleChange}

            // Email field cannot be empty
            required
          />


          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            name="password"

            // Connect the input value with React state
            value={formData.password}

            // Run handleChange whenever the user types
            onChange={handleChange}

            // Password field cannot be empty
            required
          />


          {/* Submit button for Login */}
          <button type="submit">
            Login
          </button>


        </form>


        {/* Link for users who do not have an account */}
        <p className="register-text">
          Don't have an account?{" "}

          {/* Clicking Register takes the user to /register */}
          <Link to="/register">Register</Link>
        </p>


      </div>
    </div>
  );
}


// Export Login component so other files can use it
export default Login;
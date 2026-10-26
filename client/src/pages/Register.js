// Import React and useState hook
// useState is used to store the values entered in the form
import React, { useState } from "react";

// Link is used to move to another page
// useNavigate is used to navigate using JavaScript
import { Link, useNavigate } from "react-router-dom";

// Axios is used to send HTTP requests to the backend
import axios from "axios";

// toast is used to show success, warning, and error messages
import { toast } from "react-toastify";

// CSS file for styling the Register page
import "./Register.css";


function Register() {

  // Used to navigate to another page after registration
  const navigate = useNavigate();

  // Store all registration form values in one state object
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    password: "",
    confirmPassword: "",
  });


  // This function runs whenever the user types or changes a form field
  function handleChange(e) {

    // Get the value entered by the user
    let value = e.target.value;

    // Phone number: allow only digits and maximum 10 digits
    if (e.target.name === "phone") {

      // Remove anything that is not a digit
      // Then keep only the first 10 digits
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    // Update the formData state
    setFormData({

      // Keep all the previous form values
      ...formData,

      // Update only the field that the user changed
      // Example: if name is changed, e.target.name = "name"
      [e.target.name]: value,
    });
  }


  // This function runs when the Register button/form is submitted
  async function handleSubmit(e) {

    // Prevent the browser from refreshing the page
    e.preventDefault();


    // Check whether phone number contains exactly 10 digits
    if (!/^\d{10}$/.test(formData.phone)) {

      // Show warning message to the user
      toast.warning("Phone number must contain exactly 10 digits");

      // Stop the registration process
      return;
    }


    // Check whether the email has a valid basic format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {

      // Show warning if email format is invalid
      toast.warning("Please enter a valid email address");

      // Stop the registration process
      return;
    }


    // Check whether password and confirm password are the same
    if (formData.password !== formData.confirmPassword) {

      // Show warning if passwords are different
      toast.warning("Passwords do not match");

      // Stop the registration process
      return;
    }


    // Try to send registration data to the backend
    try {

      // Send POST request to the registration API
      const response = await axios.post(
        "https://blood-management-system-api-7p86.onrender.com/api/auth/register",
        {
          // Send the user's name
          name: formData.name,

          // Send the user's email
          email: formData.email,

          // Send the user's phone number
          phone: formData.phone,

          // Send the selected role
          role: formData.role,

          // Send the password
          password: formData.password,
        }
      );


      // Show success message received from the backend
      toast.success(response.data.message);


      // After successful registration, go to Login page
      navigate("/login");

    } catch (error) {

      // Show backend error message if available
      // Otherwise show "Registration Failed"
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }


  // User interface of the Register page
  return (

    <div className="register-container">

      <div className="register-card">

        {/* Blood emoji/logo */}
        <h1>🩸</h1>

        {/* Project title */}
        <h2>Blood Management System</h2>

        {/* Page description */}
        <p>Create Your Account</p>


        {/* Registration form */}
        {/* When submitted, handleSubmit function is called */}
        <form onSubmit={handleSubmit}>

          {/* Name input */}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />


          {/* Email input */}
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          {/* Phone number input */}
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}

            // Maximum 10 characters can be entered
            maxLength="10"

            // Shows numeric keyboard on supported mobile devices
            inputMode="numeric"

            required
          />


          {/* Role selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >

            {/* Staff is selected by default */}
            <option value="Staff">Staff</option>

            {/* User can also select Admin */}
            <option value="Admin">Admin</option>

          </select>


          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          {/* Confirm password input */}
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />


          {/* Submit button */}
          <button type="submit">
            Register
          </button>

        </form>


        {/* Link for users who already have an account */}
        <p className="login-text">
          Already have an account?{" "}

          {/* Clicking Login takes the user to /login */}
          <Link to="/login">Login</Link>

        </p>

      </div>
    </div>
  );
}


// Export Register component so App.js can use it
export default Register;
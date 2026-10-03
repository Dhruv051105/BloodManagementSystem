// Import Express framework
const express = require("express");

// Create a new Express router
// This router is used to define authentication-related API routes
const router = express.Router();

// Import middleware used to check whether the user is logged in
const authMiddleware = require("../middleware/authMiddleware");

// Import middleware used to check the user's role
const authorizeRoles = require("../middleware/roleMiddleware");

// Import authentication functions from the controller
const {

  // Function used to register a new user
  registerUser,

  // Function used to login an existing user
  loginUser,

  // Function used to get the logged-in user's profile
  getProfile,

} = require("../controllers/authController");


// ===============================
// Public Routes
// These routes can be accessed without logging in
// ===============================


// Route for creating a new user account
// POST /api/auth/register
router.post("/register", registerUser);


// Route for logging in an existing user
// POST /api/auth/login
router.post("/login", loginUser);


// ===============================
// Protected Route
// User must be authenticated to access this route
// ===============================


// Route for getting the logged-in user's profile
// authMiddleware checks the user's JWT token first
// If authentication is successful, getProfile() is called
// GET /api/auth/profile
router.get("/profile", authMiddleware, getProfile);


// ===============================
// Admin Only Route
// Only authenticated Admin users can access this route
// ===============================


// Route for Admin users
// authMiddleware checks if the user is logged in
// authorizeRoles("Admin") checks if the user's role is Admin
router.get(

  // Admin route
  // GET /api/auth/admin
  "/admin",

  // Check if the user is authenticated
  authMiddleware,

  // Check if the authenticated user has Admin role
  authorizeRoles("Admin"),

  // This function runs when all checks are successful
  (req, res) => {

    // Send a successful response to the frontend
    res.status(200).json({

      // Indicates that the request was successful
      success: true,

      // Message sent to the Admin
      message: "Welcome Admin!",

      // Send the logged-in user's information
      // req.user is added by the authentication middleware
      user: req.user,

    });
  }
);


// Export the router so it can be used in server.js
module.exports = router;
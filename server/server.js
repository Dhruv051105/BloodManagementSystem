// Import all route files
// Each route file handles a different module of the project
const authRoutes = require("./routes/authRoutes");
const bloodRoutes = require("./routes/bloodRoutes");
const donationRoutes = require("./routes/donationRoutes");
const patientRoutes = require("./routes/patientRoutes");
const donorScheduleRoutes = require("./routes/donorScheduleRoutes");
const bloodIssueRoutes = require("./routes/bloodIssueRoutes");


// Import the Express framework
// Express is used to create the backend server and APIs
const express = require("express");

// Import CORS middleware
// CORS allows the React frontend to communicate with this backend
const cors = require("cors");


// Import the function that connects the backend to MongoDB
const connectDB = require("./config/db");

// Import dotenv to load environment variables from the .env file
// Example: PORT, MONGO_URI, JWT_SECRET
require("dotenv").config();


// Create an Express application
const app = express();


// Connect the backend to MongoDB
connectDB();


// Define the port on which the backend server will run
// If PORT is available in .env, use it
// Otherwise, use port 5000
const PORT = process.env.PORT || 5000;


// ===============================
// Middleware
// ===============================


// Allows requests from the React frontend
app.use(cors());


// Allows Express to read JSON data sent by the frontend
// Example: login/register form data sent using Axios
app.use(express.json());


// ===============================
// API Routes
// ===============================

// All authentication routes start with /api/auth
// Example: /api/auth/login
// Example: /api/auth/register
app.use("/api/auth", authRoutes);


// All blood stock routes start with /api/blood-stock
// Example: /api/blood-stock
app.use("/api/blood-stock", bloodRoutes);


// All donation request routes start with /api/donation-requests
app.use("/api/donation-requests", donationRoutes);


// All patient request routes start with /api/patient-requests
app.use("/api/patient-requests", patientRoutes);


// All donor schedule routes start with /api/donor-schedule
app.use("/api/donor-schedule", donorScheduleRoutes);


// All blood issue routes start with /api/blood-issues
app.use("/api/blood-issues", bloodIssueRoutes);


// ===============================
// Test Route
// ===============================

// This is a simple route to check whether the backend is running
app.get("/", (req, res) => {

  // Send this message when someone opens the backend root URL
  res.send("Blood Management System Backend is Running 🚀");
});


// ===============================
// Start Server
// ===============================

// Start the Express server on the selected port
app.listen(PORT, () => {

  // Display the server URL in the terminal
  console.log(`Server is running on http://localhost:${PORT}`);
});
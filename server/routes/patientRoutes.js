// Import Express
// Express is used to create and manage API routes
const express = require("express");


// Create an Express Router
// This keeps all Patient Request routes together
const router = express.Router();


// Import controller functions
// These functions contain the actual logic for Patient Requests
const {
  createPatientRequest,   // Create a new patient request
  getPatientRequests,     // Get all patient requests
  updatePatientStatus,    // Approve/reject/update request status
  deletePatientRequest,   // Delete a patient request
} = require("../controllers/patientController");


// Import authentication middleware
// It checks whether the user has a valid JWT token
const authMiddleware = require("../middleware/authMiddleware");


// Import role-based authorization middleware
// It checks whether the logged-in user has the required role
const roleMiddleware = require("../middleware/roleMiddleware");


// ====================================
// Staff & Admin
// Create Patient Request
// ====================================

// POST /api/patient-requests
//
// authMiddleware:
// First checks whether the user is authenticated.
//
// roleMiddleware("Admin", "Staff"):
// Allows both Admin and Staff users.
//
// createPatientRequest:
// Controller function that creates the request in MongoDB.
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  createPatientRequest
);


// ====================================
// Staff & Admin
// Get All Patient Requests
// ====================================

// GET /api/patient-requests
//
// Both Admin and Staff can view patient requests.
//
// getPatientRequests:
// Gets the patient request records from MongoDB.
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  getPatientRequests
);


// ====================================
// Admin Only
// Update Status
// ====================================

// PUT /api/patient-requests/:id
//
// :id represents the MongoDB ID of the patient request.
//
// Only Admin users can update the request status.
//
// updatePatientStatus:
// Controller function that changes the status.
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  updatePatientStatus
);


// ====================================
// Admin Only
// Delete Request
// ====================================

// DELETE /api/patient-requests/:id
//
// Only Admin users can delete a patient request.
//
// :id identifies which patient request should be deleted.
//
// deletePatientRequest:
// Controller function that deletes the request from MongoDB.
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deletePatientRequest
);


// Export the router
// server.js uses this router for /api/patient-requests
module.exports = router;
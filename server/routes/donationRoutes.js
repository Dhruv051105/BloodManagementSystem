// Import Express
// Express is used to create API routes
const express = require("express");

// Create a router object
// We use this router to define Donation Request API endpoints
const router = express.Router();


// Import the controller functions
// These functions contain the actual logic for each API operation
const {
  createDonationRequest,   // Create a new donation request
  getDonationRequests,     // Get all donation requests
  updateDonationStatus,    // Approve or reject a request
  deleteDonationRequest,   // Delete a request
} = require("../controllers/donationController");


// Import authentication middleware
// It checks whether the user has a valid JWT token
const authMiddleware = require("../middleware/authMiddleware");


// Import role-based authorization middleware
// It checks whether the logged-in user has the required role
const authorizeRoles = require("../middleware/roleMiddleware");


// ==================================
// Staff & Admin
// Create Donation Request
// ==================================

// POST /api/donation-requests
//
// authMiddleware:
// Checks if the user is logged in.
//
// authorizeRoles("Admin", "Staff"):
// Allows both Admin and Staff users.
//
// createDonationRequest:
// Controller function that saves the request to MongoDB.
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  createDonationRequest
);


// ==================================
// Staff & Admin
// View Requests
// ==================================

// GET /api/donation-requests
//
// Both Admin and Staff can view donation requests.
//
// getDonationRequests:
// Controller function that gets requests from MongoDB.
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Staff"),
  getDonationRequests
);


// ==================================
// Admin Only
// Approve / Reject
// ==================================

// PUT /api/donation-requests/:id
//
// :id is the MongoDB ID of the donation request.
//
// Only Admin users can update the status.
//
// Example:
// PUT /api/donation-requests/65abc123
//
// updateDonationStatus:
// Controller function that changes the request status.
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  updateDonationStatus
);


// ==================================
// Admin Only
// Delete
// ==================================

// DELETE /api/donation-requests/:id
//
// Only Admin users can delete a donation request.
//
// :id identifies which request should be deleted.
//
// deleteDonationRequest:
// Controller function that removes the request from MongoDB.
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  deleteDonationRequest
);


// Export the router
// server.js uses this router for /api/donation-requests
module.exports = router;
// Import Express
// Express is used to create API routes
const express = require("express");

// Create a new Express Router
// This allows us to define Blood Stock routes separately
const router = express.Router();


// Import the Blood Stock controller functions
// These functions contain the actual backend logic
const {

  // Function to create/add new blood stock
  createBloodStock,

  // Function to get all blood stock records
  getBloodStock,

  // Function to update existing blood stock
  updateBloodStock,

  // Function to delete blood stock
  deleteBloodStock,

} = require("../controllers/bloodController");


// Import authentication middleware
// It checks whether the JWT token is valid
const authMiddleware = require("../middleware/authMiddleware");


// Import role-based authorization middleware
// It checks whether the logged-in user has the required role
const authorizeRoles = require("../middleware/roleMiddleware");


// ===============================
// Create Blood Stock - Admin Only
// ===============================

// POST /api/blood-stock
//
// authMiddleware:
// Checks whether the user is authenticated
//
// authorizeRoles("Admin"):
// Checks whether the authenticated user is an Admin
//
// createBloodStock:
// Performs the actual operation of creating the stock
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin"),
  createBloodStock
);


// ===============================
// Get All Blood Stock
// ===============================

// GET /api/blood-stock
//
// authMiddleware:
// User must be logged in to get blood stock
//
// getBloodStock:
// Gets blood stock data from the database
router.get(
  "/",
  authMiddleware,
  getBloodStock
);


// ===============================
// Update Blood Stock - Admin Only
// ===============================

// PUT /api/blood-stock/:id
//
// :id represents the MongoDB ID of the stock record
//
// authMiddleware:
// Checks authentication
//
// authorizeRoles("Admin"):
// Only Admin can update
//
// updateBloodStock:
// Performs the actual update
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  updateBloodStock
);


// ===============================
// Delete Blood Stock - Admin Only
// ===============================

// DELETE /api/blood-stock/:id
//
// :id identifies which blood stock record to delete
//
// authMiddleware:
// Checks authentication
//
// authorizeRoles("Admin"):
// Only Admin can delete
//
// deleteBloodStock:
// Performs the actual deletion
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  deleteBloodStock
);


// Export the router
// server.js uses this router for /api/blood-stock
module.exports = router;
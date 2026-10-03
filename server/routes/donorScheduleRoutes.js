// Import Express
// Express is used to create API routes
const express = require("express");


// Create an Express Router
// This keeps all Donor Schedule routes organized in one file
const router = express.Router();


// Import controller functions
// These functions contain the actual logic for Donor Schedules
const {
  createDonorSchedule,   // Create a new donor schedule
  getDonorSchedules,     // Get all donor schedules
  updateDonorSchedule,   // Update an existing donor schedule
  deleteDonorSchedule,   // Delete a donor schedule
} = require("../controllers/donorScheduleController");


// Import authentication middleware
// It checks whether the user has a valid JWT token
const authMiddleware = require("../middleware/authMiddleware");


// Import role-based authorization middleware
// It checks whether the logged-in user has permission
const roleMiddleware = require("../middleware/roleMiddleware");


// ====================================
// Staff & Admin
// Create Donor Schedule
// ====================================

// POST /api/donor-schedule
//
// First:
// authMiddleware checks whether the user is logged in.
//
// Second:
// roleMiddleware allows Admin or Staff.
//
// Finally:
// createDonorSchedule handles the actual creation
// and saves the schedule in MongoDB.
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  createDonorSchedule
);


// ====================================
// Staff & Admin
// Get All Donor Schedules
// ====================================

// GET /api/donor-schedule
//
// Admin and Staff can view donor schedules.
//
// getDonorSchedules gets the schedules from MongoDB
// and sends them back to the frontend.
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  getDonorSchedules
);


// ====================================
// Staff & Admin
// Update Donor Schedule
// ====================================

// PUT /api/donor-schedule/:id
//
// :id represents the MongoDB ID of the schedule
// that we want to update.
//
// Admin and Staff are allowed to update schedules.
//
// updateDonorSchedule performs the actual update.
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  updateDonorSchedule
);


// ====================================
// Admin Only
// Delete Donor Schedule
// ====================================

// DELETE /api/donor-schedule/:id
//
// :id identifies the schedule that should be deleted.
//
// Only Admin users are allowed to delete schedules.
//
// deleteDonorSchedule performs the deletion.
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteDonorSchedule
);


// Export the router
// server.js uses this router for /api/donor-schedule
module.exports = router;
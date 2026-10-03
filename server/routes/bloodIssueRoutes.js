// Import Express framework
const express = require("express");

// Import controller functions
// These functions contain the actual blood issue logic
const {
  issueBlood,
  getBloodIssues,
  deleteBloodIssue,
} = require("../controllers/bloodIssueController");

// Middleware to check whether the user has a valid JWT token
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to check whether the logged-in user has the required role
const roleMiddleware = require("../middleware/roleMiddleware");

// Create an Express Router
const router = express.Router();

// ==========================================
// Create Blood Issue
// ==========================================
// POST /api/blood-issues
// Admin and Staff users can issue blood
// authMiddleware checks login/token
// roleMiddleware checks the user's role
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  issueBlood
);

// ==========================================
// Get All Blood Issues
// ==========================================
// GET /api/blood-issues
// Admin and Staff users can view blood issue records
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Staff"),
  getBloodIssues
);

// ==========================================
// Delete Blood Issue
// ==========================================
// DELETE /api/blood-issues/:id
// Only Admin users are allowed to delete a blood issue
// :id represents the MongoDB document ID
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteBloodIssue
);

// Export the router so it can be used in server.js
module.exports = router;
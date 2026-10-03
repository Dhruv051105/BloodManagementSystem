// Import the BloodIssue model
// Used to create, find, and delete blood issue records
const BloodIssue = require("../models/BloodIssue");

// Import the BloodStock model
// Used to check and update available blood units
const BloodStock = require("../models/BloodStock");

// ===============================
// Issue Blood
// ===============================

// This function handles issuing blood to a patient
const issueBlood = async (req, res) => {
  try {

    // Get blood issue details sent from the frontend
    const {
      patientName,
      bloodGroup,
      units,
      reason,
      issueDate,
    } = req.body;

    // ==========================================
    // Check whether the requested blood group
    // exists in the blood stock
    // ==========================================
    const stock = await BloodStock.findOne({
      bloodGroup,
    });

    // If the blood group does not exist in stock
    // return a 404 Not Found response
    if (!stock) {
      return res.status(404).json({
        message: "Blood group not found in stock.",
      });
    }

    // Check whether enough units are available
    if (stock.units < units) {
      return res.status(400).json({
        message: "Insufficient blood stock.",
      });
    }

    // ==========================================
    // Deduct the issued units from blood stock
    // ==========================================
    stock.units -= Number(units);

    // Save the updated stock in MongoDB
    await stock.save();

    // ==========================================
    // Save the blood issue record
    // ==========================================
    const bloodIssue = await BloodIssue.create({
      patientName,
      bloodGroup,
      units,
      reason,
      issueDate,

      // Store the ID of the logged-in user
      // req.user is added by authMiddleware
      issuedBy: req.user.id,
    });

    // Send successful response to the frontend
    res.status(201).json({
      message: "Blood issued successfully.",
      bloodIssue,
    });

  } catch (error) {

    // Print the actual error in the server terminal
    console.error(error);

    // Send a general server error to the frontend
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Get All Issued Blood Records
// ===============================

// This function gets all blood issue records
const getBloodIssues = async (req, res) => {
  try {

    // Find all blood issue records
    // populate() gets the name and role of the user
    // who issued the blood
    // sort() shows the newest records first
    const issues = await BloodIssue.find()
      .populate("issuedBy", "name role")
      .sort({ createdAt: -1 });

    // Send the issue records to the frontend
    res.status(200).json({
      issues,
    });

  } catch (error) {

    // Print the error in the server terminal
    console.error(error);

    // Send server error response
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Issue
// ===============================

// This function deletes a blood issue record
const deleteBloodIssue = async (req, res) => {
  try {

    // Get the issue ID from the URL
    // Example: DELETE /api/blood-issues/123
    const issue = await BloodIssue.findById(req.params.id);

    // If the issue record does not exist
    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found.",
      });
    }

    // Delete the issue record from MongoDB
    await issue.deleteOne();

    // Send successful response
    res.status(200).json({
      message: "Issue record deleted successfully.",
    });

  } catch (error) {

    // Print the error in the server terminal
    console.error(error);

    // Send server error response
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Export the controller functions
// These functions are used by bloodIssueRoutes.js
module.exports = {
  issueBlood,
  getBloodIssues,
  deleteBloodIssue,
};
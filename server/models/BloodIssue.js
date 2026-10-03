// Import Mongoose
// Mongoose is used to create the MongoDB schema and model
const mongoose = require("mongoose");

// ===============================
// Blood Issue Schema
// ===============================

// Define the structure of a Blood Issue document
const bloodIssueSchema = new mongoose.Schema(
  {
    // Name of the patient who receives the blood
    patientName: {
      type: String,
      required: true,
    },

    // Blood group that was issued
    bloodGroup: {
      type: String,
      required: true,
    },

    // Number of blood units issued
    // Minimum value is 1
    units: {
      type: Number,
      required: true,
      min: 1,
    },

    // Reason for issuing the blood
    reason: {
      type: String,
      required: true,
    },

    // Date on which the blood was issued
    issueDate: {
      type: Date,
      required: true,
    },

    // Stores the MongoDB ID of the user who issued the blood
    // ref: "User" creates a relationship with the User model
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  // Automatically adds createdAt and updatedAt fields
  {
    timestamps: true,
  }
);

// Create and export the BloodIssue model
// MongoDB will use this model to work with BloodIssue documents
module.exports = mongoose.model("BloodIssue", bloodIssueSchema);
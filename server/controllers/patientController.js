// Import the PatientRequest model
// This model is used to interact with the PatientRequest collection in MongoDB
const PatientRequest = require("../models/PatientRequest");


// =====================================
// Create Patient Request
// =====================================

// This function handles:
// POST /api/patient-requests
//
// It receives patient blood requirements,
// validates the data, and saves the request in MongoDB.
const createPatientRequest = async (req, res) => {
  try {

    // Get the data sent by the frontend
    // req.body contains the patient request form data
    const {
      patientName,
      hospitalName,
      bloodType,
      units,
      contact,
    } = req.body;


    // =====================================
    // Patient Name Validation
    // =====================================

    // Check that patient name exists
    // and contains only letters and spaces
    if (!patientName || !/^[A-Za-z\s]+$/.test(patientName)) {
      return res.status(400).json({
        message: "Patient name should contain only letters and spaces.",
      });
    }


    // =====================================
    // Hospital Name Validation
    // =====================================

    // Check that hospital name exists
    // and contains only letters and spaces
    if (!hospitalName || !/^[A-Za-z\s]+$/.test(hospitalName)) {
      return res.status(400).json({
        message: "Hospital name should contain only letters and spaces.",
      });
    }


    // =====================================
    // Blood Group Validation
    // =====================================

    // List of blood groups supported by the system
    const validBloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ];


    // Check whether the submitted blood group
    // is present in the valid blood group list
    if (!validBloodGroups.includes(bloodType)) {
      return res.status(400).json({
        message: "Invalid blood group.",
      });
    }


    // =====================================
    // Units Validation
    // =====================================

    // Blood units must be greater than zero
    //
    // Example:
    // 2  → valid
    // 0  → invalid
    // -1 → invalid
    if (!units || units <= 0) {
      return res.status(400).json({
        message: "Units must be greater than zero.",
      });
    }


    // =====================================
    // Contact Validation
    // =====================================

    // Contact number must contain exactly 10 digits
    if (!contact || !/^\d{10}$/.test(contact)) {
      return res.status(400).json({
        message: "Contact number must contain exactly 10 digits.",
      });
    }


    // =====================================
    // Save Patient Request
    // =====================================

    // Create a new patient request document
    // and save it in MongoDB using the PatientRequest model
    //
    // Every new request starts with "Pending" status
    const patientRequest = await PatientRequest.create({
      patientName,
      hospitalName,
      bloodType,
      units,
      contact,
      status: "Pending",
    });


    // Send a successful response to the frontend
    // HTTP 201 means a new resource was created
    res.status(201).json({
      success: true,
      message: "Patient request created successfully.",
      patientRequest,
    });


  } catch (error) {

    // If an unexpected server/database error occurs,
    // return HTTP 500 Server Error
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Get All Patient Requests
// =====================================

// This function handles:
// GET /api/patient-requests
//
// It retrieves all patient requests from MongoDB.
const getPatientRequests = async (req, res) => {
  try {

    // Find all patient request documents
    //
    // createdAt: -1 means descending order,
    // so the newest requests appear first.
    const patientRequests = await PatientRequest.find().sort({
      createdAt: -1,
    });


    // Send the patient requests to the frontend
    res.status(200).json({
      success: true,
      patientRequests,
    });


  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Update Patient Request Status
// =====================================

// This function handles:
// PUT /api/patient-requests/:id
//
// It is used by Admin to change the request status.
const updatePatientStatus = async (req, res) => {
  try {

    // Get the new status from the request body
    //
    // Example:
    // { status: "Approved" }
    const { status } = req.body;


    // Only these three statuses are allowed
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }


    // Find the patient request using its MongoDB ID
    // and update its status
    //
    // req.params.id comes from the ":id" in the route
    //
    // { new: true } returns the updated document
    const patientRequest = await PatientRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );


    // If no patient request is found with that ID,
    // return a 404 Not Found response
    if (!patientRequest) {
      return res.status(404).json({
        message: "Patient request not found.",
      });
    }


    // Send the updated request back to the frontend
    res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      patientRequest,
    });


  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Delete Patient Request
// =====================================

// This function handles:
// DELETE /api/patient-requests/:id
//
// It removes a patient request from MongoDB.
const deletePatientRequest = async (req, res) => {
  try {

    // Find the patient request using its MongoDB ID
    const patientRequest = await PatientRequest.findById(
      req.params.id
    );


    // If the request does not exist,
    // return a 404 Not Found response
    if (!patientRequest) {
      return res.status(404).json({
        message: "Patient request not found.",
      });
    }


    // Delete the patient request from MongoDB
    await patientRequest.deleteOne();


    // Send a successful response to the frontend
    res.status(200).json({
      success: true,
      message: "Patient request deleted successfully.",
    });


  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Export Controller Functions
// =====================================

// Export these functions so patientRoutes.js
// can use them for the API routes.
module.exports = {
  createPatientRequest,
  getPatientRequests,
  updatePatientStatus,
  deletePatientRequest,
};
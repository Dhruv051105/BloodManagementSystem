// Import the DonationRequest model
// This model is used to interact with the DonationRequest collection in MongoDB
const DonationRequest = require("../models/DonationRequest");


// ===============================
// Create Donation Request
// ===============================

// This function handles POST /api/donation-requests
// It creates a new donation request in the database
const createDonationRequest = async (req, res) => {
  try {

    // Get the submitted data from the request body
    // req.body contains the data sent by the React frontend
    const { name, age, bloodType, contact } = req.body;


    // ===============================
    // Name Validation
    // ===============================

    // Check that name exists
    // and contains only letters and spaces
    if (!name || !/^[A-Za-z\s]+$/.test(name)) {
      return res.status(400).json({
        message: "Name should contain only letters and spaces.",
      });
    }


    // ===============================
    // Age Validation
    // ===============================

    // Check that age exists
    // and is between 18 and 65
    if (!age || age < 18 || age > 65) {
      return res.status(400).json({
        message: "Age must be between 18 and 65.",
      });
    }


    // ===============================
    // Contact Validation
    // ===============================

    // Check that contact exists
    // and contains exactly 10 digits
    if (!contact || !/^\d{10}$/.test(contact)) {
      return res.status(400).json({
        message: "Contact number must contain exactly 10 digits.",
      });
    }


    // ===============================
    // Blood Group Validation
    // ===============================

    // List of blood groups allowed by the application
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
    // exists in the validBloodGroups array
    if (!validBloodGroups.includes(bloodType)) {
      return res.status(400).json({
        message: "Invalid blood group.",
      });
    }


    // ===============================
    // Save Donation Request
    // ===============================

    // Create a new DonationRequest document in MongoDB
    //
    // The status is automatically set to "Pending"
    // when a new request is created
    const donationRequest = await DonationRequest.create({
      name,
      age,
      bloodType,
      contact,
      status: "Pending",
    });


    // Send a successful response back to the frontend
    // 201 means a new resource was successfully created
    res.status(201).json({
      success: true,
      message: "Donation request submitted successfully.",
      donationRequest,
    });

  } catch (error) {

    // If something unexpected goes wrong on the server,
    // send a 500 Server Error response
    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// Get All Donation Requests
// ===============================

// This function handles GET /api/donation-requests
// It gets all donation requests from MongoDB
const getDonationRequests = async (req, res) => {
  try {

    // Find all donation request documents
    //
    // sort({ createdAt: -1 }) means:
    // newest requests appear first
    const donationRequests = await DonationRequest.find().sort({
      createdAt: -1,
    });


    // Send the requests back to the frontend
    res.status(200).json({
      success: true,
      donationRequests,
    });

  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// Update Donation Status
// ===============================

// This function handles PUT /api/donation-requests/:id
//
// It is used when an Admin:
// - Approves a request
// - Rejects a request
const updateDonationStatus = async (req, res) => {
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


    // Find the donation request using its MongoDB ID
    // and update its status
    //
    // req.params.id comes from the :id in the route
    //
    // { new: true } means return the updated document
    const donationRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );


    // If no request exists with that ID,
    // return a 404 Not Found response
    if (!donationRequest) {
      return res.status(404).json({
        message: "Donation request not found.",
      });
    }


    // Send the updated request back to the frontend
    res.status(200).json({
      success: true,
      message: "Donation request updated successfully.",
      donationRequest,
    });

  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// Delete Donation Request
// ===============================

// This function handles DELETE /api/donation-requests/:id
// It deletes a donation request from MongoDB
const deleteDonationRequest = async (req, res) => {
  try {

    // Find the donation request using its MongoDB ID
    const donationRequest = await DonationRequest.findById(req.params.id);


    // If the request does not exist,
    // return a 404 Not Found response
    if (!donationRequest) {
      return res.status(404).json({
        message: "Donation request not found.",
      });
    }


    // Delete the found donation request from MongoDB
    await donationRequest.deleteOne();


    // Send success response to the frontend
    res.status(200).json({
      success: true,
      message: "Donation request deleted successfully.",
    });

  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// Export all controller functions
// donationRoutes.js imports and uses these functions
module.exports = {
  createDonationRequest,
  getDonationRequests,
  updateDonationStatus,
  deleteDonationRequest,
};
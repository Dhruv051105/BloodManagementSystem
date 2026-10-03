// Import the DonorSchedule model
// This model is used to create, read, update and delete
// donor schedule records in MongoDB
const DonorSchedule = require("../models/DonorSchedule");


// Import the BloodStock model
// This is used when a donor completes donation.
// The donated blood unit is then added to blood stock.
const BloodStock = require("../models/BloodStock");


// =====================================
// Create Donor Schedule
// =====================================

// This function handles:
// POST /api/donor-schedule
//
// It receives donor information from the frontend,
// validates the data and creates a new schedule.
const createDonorSchedule = async (req, res) => {
  try {

    // Get donor data from the request body
    // req.body contains data sent by the frontend
    const {
      donorName,
      bloodType,
      contact,
      appointmentDate,
      appointmentTime,
    } = req.body;


    // =====================================
    // Donor Name Validation
    // =====================================

    // Check that donor name exists
    // and contains only letters and spaces
    if (!donorName || !/^[A-Za-z\s]+$/.test(donorName)) {
      return res.status(400).json({
        message: "Donor name should contain only letters and spaces.",
      });
    }


    // =====================================
    // Blood Group Validation
    // =====================================

    // List of blood groups allowed in the system
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
    // exists in the valid blood group list
    if (!validBloodGroups.includes(bloodType)) {
      return res.status(400).json({
        message: "Invalid blood group.",
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
    // Date Validation
    // =====================================

    // Appointment date is required
    if (!appointmentDate) {
      return res.status(400).json({
        message: "Appointment date is required.",
      });
    }


    // =====================================
    // Time Validation
    // =====================================

    // Appointment time is required
    if (!appointmentTime) {
      return res.status(400).json({
        message: "Appointment time is required.",
      });
    }


    // =====================================
    // Create Donor Schedule
    // =====================================

    // Create a new donor schedule document
    // and save it in MongoDB
    //
    // New schedules start with Pending status
    const donor = await DonorSchedule.create({
      donorName,
      bloodType,
      contact,
      appointmentDate,
      appointmentTime,
      status: "Pending",
    });


    // Send successful response to the frontend
    // HTTP 201 means a new resource was created
    res.status(201).json({
      success: true,
      message: "Donor schedule created successfully.",
      donor,
    });


  } catch (error) {

    // Handle unexpected server or database errors
    // HTTP 500 means Internal Server Error
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Get All Donor Schedules
// =====================================

// This function handles:
// GET /api/donor-schedule
//
// It gets all donor schedules from MongoDB.
const getDonorSchedules = async (req, res) => {
  try {

    // Find all donor schedules
    //
    // appointmentDate: 1 means ascending order
    // so earlier appointments appear first.
    const donors = await DonorSchedule.find().sort({
      appointmentDate: 1,
    });


    // Send the schedules to the frontend
    res.status(200).json({
      success: true,
      donors,
    });


  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Update Donor Schedule
// =====================================

// This function handles:
// PUT /api/donor-schedule/:id
//
// It updates an existing donor schedule.
const updateDonorSchedule = async (req, res) => {
  try {

    // Find the donor schedule using its MongoDB ID
    //
    // req.params.id comes from the :id in the route
    const donor = await DonorSchedule.findById(req.params.id);


    // If the schedule does not exist,
    // return a 404 Not Found response
    if (!donor) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }


    // Store the old status before updating
    // We need this to check whether the donor
    // has changed from Pending to Completed.
    const oldStatus = donor.status;


    // Get the new status from the request body
    const newStatus = req.body.status;


    // =====================================
    // Update Donor Schedule
    // =====================================

    // Update donor name if a new value was provided
    // Otherwise keep the existing donor name
    donor.donorName =
      req.body.donorName || donor.donorName;


    // Update blood type if a new value was provided
    // Otherwise keep the old blood type
    donor.bloodType =
      req.body.bloodType || donor.bloodType;


    // Update contact if a new value was provided
    // Otherwise keep the old contact number
    donor.contact =
      req.body.contact || donor.contact;


    // Update appointment date if provided
    // Otherwise keep the existing date
    donor.appointmentDate =
      req.body.appointmentDate || donor.appointmentDate;


    // Update appointment time if provided
    // Otherwise keep the existing time
    donor.appointmentTime =
      req.body.appointmentTime || donor.appointmentTime;


    // Update status if a new status was provided
    // Otherwise keep the existing status
    donor.status =
      req.body.status || donor.status;


    // =====================================
    // Increase Blood Stock ONLY once
    // =====================================

    // Check whether:
    //
    // Old status = Pending
    // AND
    // New status = Completed
    //
    // This means the donor has completed the donation.
    if (
      oldStatus === "Pending" &&
      newStatus === "Completed"
    ) {

      // Find the blood stock record
      // that matches the donor's blood group
      const stock = await BloodStock.findOne({
        bloodGroup: donor.bloodType,
      });


      // If there is no blood stock record
      // for this blood group, return an error
      if (!stock) {
        return res.status(404).json({
          message: "Blood stock not found.",
        });
      }


      // Add one blood unit to the existing stock
      stock.units += 1;


      // Save the updated blood stock to MongoDB
      await stock.save();
    }


    // Save all changes made to the donor schedule
    await donor.save();


    // Send the updated donor schedule to the frontend
    res.status(200).json({
      success: true,
      message: "Schedule updated successfully.",
      donor,
    });


  } catch (error) {

    // Handle server/database errors
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================
// Delete Donor Schedule
// =====================================

// This function handles:
// DELETE /api/donor-schedule/:id
//
// It deletes a donor schedule from MongoDB.
const deleteDonorSchedule = async (req, res) => {
  try {

    // Find the donor schedule using its MongoDB ID
    const donor = await DonorSchedule.findById(req.params.id);


    // If the schedule does not exist,
    // return a 404 Not Found response
    if (!donor) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }


    // Delete the donor schedule from MongoDB
    await donor.deleteOne();


    // Send successful response to the frontend
    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully.",
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

// Export these functions so donorScheduleRoutes.js
// can use them for the API routes.
module.exports = {
  createDonorSchedule,
  getDonorSchedules,
  updateDonorSchedule,
  deleteDonorSchedule,
};
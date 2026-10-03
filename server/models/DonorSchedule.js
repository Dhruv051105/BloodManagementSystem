// Import Mongoose
// Mongoose helps Node.js communicate with MongoDB
const mongoose = require("mongoose");


// Create the schema for a Donor Schedule
// A schema defines the structure and rules
// for donor schedule data stored in MongoDB
const donorScheduleSchema = new mongoose.Schema(
  {
    
    // Name of the donor
    donorName: {
      // Donor name is stored as text
      type: String,

      // Donor name is required
      required: true,

      // Removes extra spaces from the beginning and end
      trim: true,
    },


    // Blood group of the donor
    bloodType: {
      // Blood group is stored as text
      type: String,

      // Blood group is required
      required: true,
    },


    // Donor's contact number
    contact: {
      // Contact number is stored as text
      // because it is a phone number, not a number for calculations
      type: String,

      // Contact number is required
      required: true,
    },


    // Date of the donor's appointment
    appointmentDate: {
      // Stored as a Date in MongoDB
      type: Date,

      // Appointment date is required
      required: true,
    },


    // Time of the donor's appointment
    appointmentTime: {
      // Time is stored as text
      // Example: "10:30 AM"
      type: String,

      // Appointment time is required
      required: true,
    },


    // Current status of the donor schedule
    status: {
      // Status is stored as text
      type: String,

      // Only these three statuses are allowed
      enum: [
        "Pending",
        "Completed",
        "Cancelled"
      ],

      // Every new donor schedule starts as Pending
      default: "Pending",
    },
  },


  {
    // Automatically creates:
    // createdAt → when the schedule was created
    // updatedAt → when the schedule was last updated
    timestamps: true,
  }
);


// Create the DonorSchedule model from the schema
// This model is used by the controller to interact with MongoDB
module.exports = mongoose.model(
  "DonorSchedule",
  donorScheduleSchema
);
// Import Mongoose
// Mongoose helps Node.js communicate with MongoDB
const mongoose = require("mongoose");


// Create the schema for a Donation Request
// A schema defines the structure and rules of the data
const donationRequestSchema = new mongoose.Schema(
  {
    
    // Donor's full name
    name: {
      // Name is stored as text
      type: String,

      // Name is required
      required: true,

      // Removes extra spaces from the beginning and end
      trim: true,
    },


    // Donor's age
    age: {
      // Age is stored as a number
      type: Number,

      // Age is required
      required: true,

      // Minimum allowed age is 18
      min: 18,

      // Maximum allowed age is 65
      max: 65,
    },


    // Donor's blood group
    bloodType: {
      // Blood group is stored as text
      type: String,

      // Blood group is required
      required: true,

      // Only these blood groups are allowed
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-"
      ],
    },


    // Donor's contact number
    contact: {
      // Contact number is stored as text
      // String is useful because we are storing a phone number,
      // not performing mathematical calculations on it
      type: String,

      // Contact number is required
      required: true,

      // Removes extra spaces from the beginning and end
      trim: true,
    },


    // Current status of the donation request
    status: {
      // Status is stored as text
      type: String,

      // Only these three statuses are allowed
      enum: [
        "Pending",
        "Approved",
        "Rejected"
      ],

      // New donation requests start as Pending
      default: "Pending",
    },
  },


  {
    // Automatically creates:
    // createdAt → when the request was created
    // updatedAt → when the request was last updated
    timestamps: true,
  }
);


// Create the DonationRequest model from the schema
// This model is used by the controller to interact with MongoDB
module.exports = mongoose.model(
  "DonationRequest",
  donationRequestSchema
);
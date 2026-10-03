// Import Mongoose
// Mongoose helps Node.js communicate with MongoDB
const mongoose = require("mongoose");


// Create the schema for a Patient Request
// A schema defines the structure and validation rules
// for patient request data stored in MongoDB
const patientRequestSchema = new mongoose.Schema(
  {
    
    // Name of the patient who needs blood
    patientName: {
      // Patient name is stored as text
      type: String,

      // Patient name is required
      required: true,

      // Removes extra spaces from the beginning and end
      trim: true,
    },


    // Name of the hospital requesting blood
    hospitalName: {
      // Hospital name is stored as text
      type: String,

      // Hospital name is required
      required: true,

      // Removes extra spaces from the beginning and end
      trim: true,
    },


    // Blood group required by the patient
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
        "O-",
      ],
    },


    // Number of blood units required by the patient
    units: {
      // Units are stored as a number
      type: Number,

      // Units are required
      required: true,
    },


    // Contact number of the patient/hospital
    contact: {
      // Contact number is stored as text
      // because it is a phone number, not a value for calculation
      type: String,

      // Contact number is required
      required: true,
    },


    // Current status of the patient request
    status: {
      // Status is stored as text
      type: String,

      // Only these three statuses are allowed
      enum: [
        "Pending",
        "Approved",
        "Rejected"
      ],

      // Every new patient request starts as Pending
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


// Create the PatientRequest model from the schema
// This model is used by the controller to interact with MongoDB
module.exports = mongoose.model(
  "PatientRequest",
  patientRequestSchema
);
// Import Mongoose
// Mongoose helps Node.js communicate with MongoDB
const mongoose = require("mongoose");


// Create a schema for Blood Stock
// A schema defines what fields a Blood Stock document should have
const bloodStockSchema = new mongoose.Schema(
  {

    // Blood group field
    bloodGroup: {
      // Blood group will be stored as a String
      type: String,

      // Blood group is required
      required: true,

      // Two records cannot have the same blood group
      unique: true,

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


    // Number of blood units available
    units: {
      // Units are stored as a Number
      type: Number,

      // Units are required
      required: true,

      // Units cannot be less than 0
      min: 0,

      // If units are not provided, the default value is 0
      default: 0,
    },
  },


  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);


// Create and export the BloodStock model
// This model is used by the controller to read/write data in MongoDB
module.exports = mongoose.model("BloodStock", bloodStockSchema);
// Import Mongoose to create the structure of our MongoDB data
const mongoose = require("mongoose");


// Create a schema that defines the structure of a User
const userSchema = new mongoose.Schema(
  {
    // Store the user's full name
    name: {
      // Name will be stored as text
      type: String,

      // Name is required
      required: true,

      // Remove extra spaces from the beginning and end
      trim: true,
    },


    // Store the user's email address
    email: {
      // Email will be stored as text
      type: String,

      // Email is required
      required: true,

      // Two users cannot register with the same email
      unique: true,

      // Convert email to lowercase before storing
      lowercase: true,

      // Remove extra spaces from the beginning and end
      trim: true,
    },


    // Store the user's phone number
    phone: {
      // Phone is stored as text
      type: String,

      // Phone number is required
      required: true,

      // Remove extra spaces from the beginning and end
      trim: true,
    },


    // Store the user's role in the system
    role: {
      // Role is stored as text
      type: String,

      // Only Admin or Staff can be used as a role
      enum: ["Admin", "Staff"],

      // If no role is provided, Staff will be used
      default: "Staff",
    },


    // Store the user's password
    password: {
      // Password is stored as text
      // In our controller, the password is hashed before saving
      type: String,

      // Password is required
      required: true,

      // Password must contain at least 6 characters
      minlength: 6,
    },
  },


  {
    // Automatically create createdAt and updatedAt fields
    timestamps: true,
  }
);


// Create and export the User model
// "User" is the name of the MongoDB model/collection interface
module.exports = mongoose.model("User", userSchema);
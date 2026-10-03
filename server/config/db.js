// Import Mongoose to connect the Node.js application with MongoDB
const mongoose = require("mongoose");


// Create an asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {

    // Connect to MongoDB using the database URL stored in MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);

    // Show a success message in the backend terminal
    console.log("✅ MongoDB Connected Successfully");

  } catch (error) {

    // Show a message if the database connection fails
    console.error("❌ MongoDB Connection Failed");

    // Show the actual error message
    console.error(error.message);

    // Stop the server if MongoDB connection fails
    process.exit(1);
  }
};


// Export the connectDB function so server.js can use it
module.exports = connectDB;
// Import the BloodStock model
// This model is used to interact with the BloodStock collection in MongoDB
const BloodStock = require("../models/BloodStock");


// ===============================
// Create Blood Stock
// ===============================

// This function adds a new blood stock record to MongoDB
const createBloodStock = async (req, res) => {

  try {

    // Get bloodGroup and units sent by the frontend
    // req.body contains the data sent in the POST request
    const { bloodGroup, units } = req.body;


    // Check whether bloodGroup and units were provided
    if (!bloodGroup || units === undefined) {

      // Send 400 Bad Request if required data is missing
      return res.status(400).json({
        success: false,
        message: "Blood group and units are required.",
      });
    }


    // Check whether this blood group already exists in MongoDB
    const existingBlood = await BloodStock.findOne({ bloodGroup });


    // If the blood group already exists, do not create another record
    if (existingBlood) {

      // Send error response
      return res.status(400).json({
        success: false,
        message: "Blood group already exists.",
      });
    }


    // Create a new blood stock document in MongoDB
    const bloodStock = await BloodStock.create({
      bloodGroup,
      units,
    });


    // Send successful response back to the frontend
    res.status(201).json({
      success: true,
      message: "Blood stock created successfully.",

      // Send the newly created stock record
      bloodStock,
    });


  } catch (error) {

    // If something goes wrong, send server error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ===============================
// Get All Blood Stock
// ===============================

// This function gets all blood stock records from MongoDB
const getBloodStock = async (req, res) => {

  try {

    // Find all BloodStock documents
    // sort({ bloodGroup: 1 }) sorts blood groups in ascending order
    const bloodStocks = await BloodStock.find().sort({
      bloodGroup: 1,
    });


    // Send the blood stock data to the frontend
    res.status(200).json({
      success: true,

      // Number of blood stock records
      count: bloodStocks.length,

      // Actual array containing the stock records
      bloodStocks,
    });


  } catch (error) {

    // Send server error if database operation fails
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ===============================
// Update Blood Stock
// ===============================

// This function updates the units of an existing blood stock record
const updateBloodStock = async (req, res) => {

  try {

    // Get the record ID from the URL
    // Example: /api/blood-stock/65abc123
    const { id } = req.params;


    // Get the new units value from the request body
    const { units } = req.body;


    // Find the record by ID and update its units
    const updatedBlood = await BloodStock.findByIdAndUpdate(

      // ID of the record to update
      id,

      // Data that should be updated
      { units },

      {
        // Return the updated document instead of the old one
        new: true,

        // Run schema validation before updating
        runValidators: true,
      }
    );


    // If no record was found with that ID
    if (!updatedBlood) {

      // Send 404 Not Found
      return res.status(404).json({
        success: false,
        message: "Blood stock not found.",
      });
    }


    // Send the updated record to the frontend
    res.status(200).json({
      success: true,
      message: "Blood stock updated successfully.",
      updatedBlood,
    });


  } catch (error) {

    // Send server error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ===============================
// Delete Blood Stock
// ===============================

// This function deletes a blood stock record
const deleteBloodStock = async (req, res) => {

  try {

    // Get the record ID from the URL
    const { id } = req.params;


    // Find the record by ID and delete it from MongoDB
    const deletedBlood = await BloodStock.findByIdAndDelete(id);


    // If no record was found
    if (!deletedBlood) {

      // Send 404 Not Found
      return res.status(404).json({
        success: false,
        message: "Blood stock not found.",
      });
    }


    // Send successful response
    res.status(200).json({
      success: true,
      message: "Blood stock deleted successfully.",

      // Send the deleted record in the response
      deletedBlood,
    });


  } catch (error) {

    // Send server error
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Export all controller functions
// bloodRoutes.js imports these functions and connects them to API routes
module.exports = {
  createBloodStock,
  getBloodStock,
  updateBloodStock,
  deleteBloodStock,
};

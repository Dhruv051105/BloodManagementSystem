// Import React
// useEffect is used to run code when the page loads
// useState is used to store and update data in the page
import React, { useEffect, useState } from "react";

// jsPDF is used to create PDF files
import jsPDF from "jspdf";

// autoTable is used to create tables inside the PDF
import autoTable from "jspdf-autotable";

// Axios is used to communicate with the backend API
import axios from "axios";

// Toast is used to show success, warning, and error messages
import { toast } from "react-toastify";

// CSS file for styling the Blood Stock page
import "./BloodStock.css";


// Base URL of the Blood Stock API
// All GET, POST, PUT and DELETE requests use this URL
const API_URL = "http://localhost:5000/api/blood-stock";


const BloodStock = () => {

  // Store all blood stock records received from the backend
  const [bloodStocks, setBloodStocks] = useState([]);


  // Store the selected blood group from the form
  const [bloodGroup, setBloodGroup] = useState("");

  // Store the number of units entered in the form
  const [units, setUnits] = useState("");


  // Store the ID of the stock being edited
  // null means we are currently adding new stock
  const [editId, setEditId] = useState(null);


  // Get logged-in user information from LocalStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Check whether the logged-in user is an Admin
  const isAdmin = user?.role === "Admin";


  // Get JWT token from LocalStorage
  // This token is sent with protected API requests
  const token = localStorage.getItem("token");


  // ===============================
  // Fetch Blood Stock
  // ===============================

  // Get all blood stock records from the backend
  const fetchBloodStock = async () => {

    try {

      // Send GET request to the Blood Stock API
      const response = await axios.get(API_URL, {

        // Send JWT token to the backend
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      // Store the blood stock data in React state
      // The backend response contains the bloodStocks array
      setBloodStocks(response.data.bloodStocks);


    } catch (error) {

      // Display error in the browser console
      console.log(error);

      // Show error message to the user
      toast.error("Unable to fetch blood stock.");
    }
  };


  // ===============================
  // Reset Form
  // ===============================

  // Clear the form and exit edit mode
  const resetForm = () => {

    // Clear selected blood group
    setBloodGroup("");

    // Clear units
    setUnits("");

    // null means we are no longer editing
    setEditId(null);
  };


  // ===============================
  // Add / Update Blood Stock
  // ===============================

  // This function runs when the Admin submits the form
  const handleSubmit = async (e) => {

    // Prevent normal browser form submission/reload
    e.preventDefault();


    // Make sure a blood group has been selected
    if (!bloodGroup) {

      // Show warning message
      toast.warning("Please select a blood group.");

      // Stop the function
      return;
    }


    // Make sure units are not negative
    if (Number(units) < 0) {

      // Show warning message
      toast.warning("Units cannot be negative.");

      // Stop the function
      return;
    }


    try {

      // If editId exists, we are editing an existing record
      if (editId) {


        // Send PUT request to update the existing stock
        await axios.put(
          `${API_URL}/${editId}`,

          {
            // Send updated units
            units: Number(units),
          },

          {
            // Send JWT token
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Show success message
        toast.success("Blood Stock Updated Successfully");


      } else {

        // If editId does not exist,
        // create a new blood stock record
        await axios.post(
          API_URL,

          {
            // Send selected blood group
            bloodGroup,

            // Convert units from string to number
            units: Number(units),
          },

          {
            // Send JWT token
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Show success message
        toast.success("Blood Stock Added Successfully");
      }


      // Clear the form after successful operation
      resetForm();

      // Fetch latest blood stock data
      // This makes the updated data appear in the table
      fetchBloodStock();


    } catch (error) {

      // Show backend error message if available
      // Otherwise show a general error message
      toast.error(
        error.response?.data?.message ||
          "Operation Failed"
      );
    }
  };


  // ===============================
  // Edit Blood Stock
  // ===============================

  // This function runs when Admin clicks Edit
  const handleEdit = (stock) => {

    // Store the ID of the record being edited
    setEditId(stock._id);

    // Put the existing blood group into the form
    setBloodGroup(stock.bloodGroup);

    // Put the existing units into the form
    setUnits(stock.units);


    // Scroll to the top so the user can see the form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ===============================
  // Delete Blood Stock
  // ===============================

  // This function deletes a blood stock record
  const handleDelete = async (id) => {


    // Ask the Admin to confirm before deleting
    const confirmDelete = window.confirm(
      "Delete this Blood Stock?"
    );


    // If Admin clicks Cancel, stop the function
    if (!confirmDelete) return;


    try {

      // Send DELETE request to the backend
      // The id identifies which stock record should be deleted
      await axios.delete(
        `${API_URL}/${id}`,

        {
          // Send JWT token
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // Show success message
      toast.success("Blood Stock Deleted Successfully");


      // Fetch the latest data after deletion
      fetchBloodStock();


    } catch (error) {

      // Show backend error if available
      toast.error(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };


  // ===============================
  // Generate PDF Report
  // ===============================

  // Create and download a PDF containing blood stock information
  const generatePDF = () => {

    // Create a new PDF document
    const doc = new jsPDF();


    // Set the title font size
    doc.setFontSize(18);

    // Add report title
    doc.text("Blood Stock Report", 14, 20);


    // Create a table in the PDF
    autoTable(doc, {

      // Starting position of the table
      startY: 30,

      // Table column headings
      head: [["#", "Blood Group", "Units"]],

      // Convert bloodStocks into rows
      body: bloodStocks.map((stock, index) => [

        // Row number
        index + 1,

        // Blood group
        stock.bloodGroup,

        // Units
        stock.units,
      ]),
    });


    // Calculate total blood units
    const totalUnits = bloodStocks.reduce(
      (sum, stock) => sum + Number(stock.units),
      0
    );


    // Display total units below the table
    doc.text(
      `Total Units: ${totalUnits}`,
      14,
      doc.lastAutoTable.finalY + 15
    );


    // Display the date and time when the report was generated
    doc.text(
      `Generated On: ${new Date().toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 25
    );


    // Download/save the PDF file
    doc.save("Blood_Stock_Report.pdf");
  };


  // ===============================
  // Load Data
  // ===============================

  // Run fetchBloodStock when the Blood Stock page loads
  useEffect(() => {

    fetchBloodStock();

  }, []);


  // Calculate total units for the Blood Stock page
  const totalUnits = bloodStocks.reduce(
    (sum, item) => sum + item.units,
    0
  );


  // ===============================
  // User Interface
  // ===============================

  return (

    <div className="blood-stock-container">

      <div className="page-card">


        {/* ==========================
            Page Heading
        ========================== */}

        <div className="page-heading">

          <div>

            {/* Small section title */}
            <p className="section-label">
              Inventory Overview
            </p>

            {/* Main page heading */}
            <h2>Blood Stock Dashboard</h2>

          </div>


          {/* PDF button and status */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center"
            }}
          >

            {/* Button to generate and download PDF */}
            <button
              type="button"
              onClick={generatePDF}
              className="download-btn"
            >
              Download PDF
            </button>


            {/* Display current status */}
            <div className="status-pill">
              Live Update
            </div>

          </div>

        </div>


        {/* ==========================
            Admin Form
        ========================== */}

        {/* 
          Only Admin users can see this form.
          isAdmin is true only when user.role === "Admin".
        */}
        {isAdmin && (

          <form
            className="blood-form"
            onSubmit={handleSubmit}
          >

            {/* Blood group selection */}
            <select
              value={bloodGroup}

              // Disable blood group selection while editing
              disabled={editId !== null}

              // Update bloodGroup when selection changes
              onChange={(e) =>
                setBloodGroup(e.target.value)
              }

              required
            >

              <option value="">
                Select Blood Group
              </option>

              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>

            </select>


            {/* Units input */}
            <input
              type="number"
              value={units}
              placeholder="Units"
              min="0"

              // Update units whenever the user types
              onChange={(e) =>
                setUnits(e.target.value)
              }

              required
            />


            {/* 
              Button text changes depending on the mode:
              Add mode  → Add Blood Stock
              Edit mode → Update Blood Stock
            */}
            <button type="submit">

              {editId
                ? "Update Blood Stock"
                : "Add Blood Stock"}

            </button>


            {/* Show Cancel button only while editing */}
            {editId && (

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </form>

        )}


        {/* ==========================
             Dashboard Cards
        ========================== */}

        <div className="stats-row">


          {/* Total units card */}
          <div className="stat-card">

            <span>Total Units</span>

            <strong>{totalUnits}</strong>

          </div>


          {/* Number of different stock records */}
          <div className="stat-card">

            <span>Types Available</span>

            <strong>{bloodStocks.length}</strong>

          </div>


          {/* Currently displayed critical blood group */}
          <div className="stat-card">

            <span>Critical Group</span>

            <strong>AB+</strong>

          </div>

        </div>


        {/* ==========================
             Blood Stock Table
        ========================== */}

        <table className="blood-stock-table">

          <thead>

            <tr>

              <th>#</th>

              <th>Blood Group</th>

              <th>Units</th>

              <th>Created</th>

              {/* Actions column is shown only to Admin */}
              {isAdmin && (
                <th>Actions</th>
              )}

            </tr>

          </thead>


          <tbody>


            {/* 
              If there are no blood stock records,
              show a message instead of the table rows.
            */}
            {bloodStocks.length === 0 ? (

              <tr>

                <td
                  colSpan={
                    isAdmin ? 5 : 4
                  }
                  className="empty-row"
                >
                  No Blood Stock Available
                </td>

              </tr>

            ) : (

              // If data exists, create one table row for each stock record
              bloodStocks.map(
                (stock, index) => (

                  <tr key={stock._id}>

                    {/* Display row number */}
                    <td>{index + 1}</td>


                    {/* Display blood group */}
                    <td>
                      {stock.bloodGroup}
                    </td>


                    {/* Display units */}
                    <td>
                      {stock.units}
                    </td>


                    {/* Display creation date */}
                    <td>
                      {new Date(
                        stock.createdAt
                      ).toLocaleDateString()}
                    </td>


                    {/* Show Edit/Delete buttons only to Admin */}
                    {isAdmin && (

                      <td>

                        {/* Edit button */}
                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(stock)
                          }
                        >
                          Edit
                        </button>


                        {/* Delete button */}
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              stock._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    )}

                  </tr>
                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};


// Export BloodStock component
// This allows App.js to display the Blood Stock page
export default BloodStock;
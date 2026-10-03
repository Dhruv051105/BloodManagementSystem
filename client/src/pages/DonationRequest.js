import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { toast } from "react-toastify";
import "./DonationRequest.css";

const API_URL = "http://localhost:5000/api/donation-requests";

const DonationRequest = () => {
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    bloodType: "",
    contact: "",
  });

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role === "Admin";

  // ===========================
  // Fetch Requests
  // ===========================

  const fetchRequests = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data.donationRequests);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ===========================
  // Handle Input Change
  // ===========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name Validation
    if (name === "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setForm({
          ...form,
          name: value,
        });
      }
      return;
    }

    // Age Validation (Only Numbers)
    if (name === "age") {
      if (/^\d*$/.test(value)) {
        setForm({
          ...form,
          age: value,
        });
      }
      return;
    }

    // Contact Validation (Only Numbers)
    if (name === "contact") {
      if (/^\d*$/.test(value)) {
        setForm({
          ...form,
          contact: value,
        });
      }
      return;
    }

    // Blood Group
    setForm({
      ...form,
      [name]: value,
    });
  };

  // ===========================
  // Submit Request
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name Validation

    if (!/^[A-Za-z\s]+$/.test(form.name)) {
      toast.warning("Name should contain only letters.");
return;
    }

    // Age Validation

    if (
      Number(form.age) < 18 ||
      Number(form.age) > 65
    ) {
      toast.warning(
  "Age must be between 18 and 65."
);
return;
    }

    // Contact Validation

    if (!/^\d{10}$/.test(form.contact)) {
      toast.warning(
  "Contact Number must contain exactly 10 digits."
);
return;
    }

    try {

      await axios.post(
        API_URL,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Donation Request Submitted Successfully");

      setForm({
        name: "",
        age: "",
        bloodType: "",
        contact: "",
      });

      fetchRequests();

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Something went wrong."
);

    }
  };

  // ===========================
  // Update Status
  // ===========================

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await axios.put(
        `${API_URL}/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Request ${status.toLowerCase()} successfully.`);

      fetchRequests();

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Unable to update status."
);

    }

  };
  // ===========================
  // Delete Request
  // ===========================

  const deleteRequest = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation request?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Donation Request Deleted Successfully");

      fetchRequests();

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Delete Failed"
);

    }

  };

  const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Donation Request Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["#", "Name", "Age", "Blood Group", "Contact", "Status"]],
    body: requests.map((request, index) => [
      index + 1,
      request.name,
      request.age,
      request.bloodType,
      request.contact,
      request.status,
    ]),
  });

  doc.text(
    `Total Requests: ${requests.length}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.text(
    `Generated On: ${new Date().toLocaleString()}`,
    14,
    doc.lastAutoTable.finalY + 25
  );

  doc.save("Donation_Request_Report.pdf");
};

  return (
    <div className="donation-request-container">

      <div className="page-card">

<div className="page-heading">

  <div>
    <p className="section-label">
      Donor Support
    </p>

    <h2>Donation Request</h2>
  </div>

  <div className="page-actions">

    <button
      type="button"
      className="download-btn"
      onClick={generatePDF}
    >
      Download PDF
    </button>

    <div className="status-pill">
      Live
    </div>

  </div>

</div>

        {/* ===========================
            Donation Form
        =========================== */}

        <form
          className="donation-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="age"
            placeholder="Age"
            value={form.age}
            maxLength="2"
            onChange={handleChange}
            required
          />

          <select
            name="bloodType"
            value={form.bloodType}
            onChange={handleChange}
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

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            maxLength="10"
            onChange={handleChange}
            required
          />

          <button type="submit">
            Submit Request
          </button>

        </form>

        {/* ===========================
            Request Table
        =========================== */}

        <table className="request-table">

          <thead>

            <tr>

              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Blood Group</th>
              <th>Contact</th>
              <th>Status</th>

              {isAdmin && (
                <th>Actions</th>
              )}

            </tr>

          </thead>

          <tbody>

            {requests.length === 0 ? (

              <tr>

                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="empty-row"
                >
                  No Donation Requests Found
                </td>

              </tr>

            ) : (

              requests.map((request, index) => (

                <tr key={request._id}>

                  <td>{index + 1}</td>

                  <td>{request.name}</td>

                  <td>{request.age}</td>

                  <td>{request.bloodType}</td>

                  <td>{request.contact}</td>

                  <td>

                    <span
                      className={`status ${request.status.toLowerCase()}`}
                    >
                      {request.status}
                    </span>

                  </td>

                  {isAdmin && (

                    <td>

                      <button
                        className="approve-btn"
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "Approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateStatus(
                            request._id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteRequest(
                            request._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  )}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DonationRequest;
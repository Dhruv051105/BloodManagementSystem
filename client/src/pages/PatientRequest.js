import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { toast } from "react-toastify";
import "./PatientRequest.css";

const API_URL = "http://localhost:5000/api/patient-requests";

const PatientRequest = () => {
  const [requests, setRequests] = useState([]);

  const [request, setRequest] = useState({
    patientName: "",
    hospitalName: "",
    bloodType: "",
    units: "",
    contact: "",
  });

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role === "Admin";

  // ===========================
  // Fetch Patient Requests
  // ===========================

  const fetchRequests = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data.patientRequests);

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

    // Patient Name
    if (name === "patientName") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setRequest({
          ...request,
          patientName: value,
        });
      }
      return;
    }

    // Hospital Name
    if (name === "hospitalName") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setRequest({
          ...request,
          hospitalName: value,
        });
      }
      return;
    }

    // Units
    if (name === "units") {
      if (/^\d*$/.test(value)) {
        setRequest({
          ...request,
          units: value,
        });
      }
      return;
    }

    // Contact
    if (name === "contact") {
      if (/^\d*$/.test(value)) {
        setRequest({
          ...request,
          contact: value,
        });
      }
      return;
    }

    setRequest({
      ...request,
      [name]: value,
    });
  };
    // ===========================
  // Submit Patient Request
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Patient Name Validation
    if (!/^[A-Za-z\s]+$/.test(request.patientName)) {
      toast.warning("Patient name should contain only letters.");
return;
    }

    // Hospital Validation
    if (!/^[A-Za-z\s]+$/.test(request.hospitalName)) {
      toast.warning("Hospital name should contain only letters.");
return;
    }

    // Units Validation
    if (Number(request.units) <= 0) {
      toast.warning("Units must be greater than 0.");
return;
    }

    // Contact Validation
    if (!/^\d{10}$/.test(request.contact)) {
      toast.warning(
  "Contact number must contain exactly 10 digits."
);
return;
    }

    try {
      await axios.post(API_URL, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Patient Request Submitted Successfully");

      setRequest({
        patientName: "",
        hospitalName: "",
        bloodType: "",
        units: "",
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
  // Update Request Status
  // ===========================

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/${id}`,
        { status },
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
      "Are you sure you want to delete this request?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Patient Request Deleted Successfully");

      fetchRequests();

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Delete failed."
);
    }
  };

  const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Patient Request Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "#",
      "Patient",
      "Hospital",
      "Blood Group",
      "Units",
      "Contact",
      "Status",
    ]],
    body: requests.map((item, index) => [
      index + 1,
      item.patientName,
      item.hospitalName,
      item.bloodType,
      item.units,
      item.contact,
      item.status,
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

  doc.save("Patient_Request_Report.pdf");
};
    return (
    <div className="patient-request-container">
      <div className="page-card form-card">

        <div className="page-heading">
  <div>
    <p className="section-label">Patient Care</p>

    <h2>Patient Blood Request Form</h2>

    <p className="logged-user">
      Logged in as: <strong>{user?.role}</strong>
    </p>
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
    Urgent Needs
  </div>

</div>
</div>

        <form
          onSubmit={handleSubmit}
          className="patient-request-form"
        >
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={request.patientName}
            onChange={handleChange}
            required
          />

          <select
            name="bloodType"
            value={request.bloodType}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <input
            type="number"
            name="units"
            placeholder="Units Needed"
            value={request.units}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            value={request.hospitalName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={request.contact}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Submit Request
          </button>
        </form>

        <table className="request-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Hospital</th>
              <th>Blood</th>
              <th>Units</th>
              <th>Contact</th>
              <th>Status</th>

              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>

            {requests.length === 0 ? (

              <tr>
                <td
                  colSpan={isAdmin ? 8 : 7}
                  style={{ textAlign: "center" }}
                >
                  No Patient Requests Found
                </td>
              </tr>

            ) : (

              requests.map((item, index) => (

                <tr key={item._id}>

                  <td>{index + 1}</td>
                  <td>{item.patientName}</td>
                  <td>{item.hospitalName}</td>
                  <td>{item.bloodType}</td>
                  <td>{item.units}</td>
                  <td>{item.contact}</td>

                  <td>
                    <span
                      className={`status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {isAdmin && (
                    <td>
                                            <button
                        className="approve-btn"
                        onClick={() =>
                          updateStatus(item._id, "Approved")
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateStatus(item._id, "Rejected")
                        }
                      >
                        Reject
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteRequest(item._id)
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

export default PatientRequest;
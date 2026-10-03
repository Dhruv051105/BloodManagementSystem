import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { toast } from "react-toastify";

import "./BloodIssue.css";

function BloodIssue() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    units: "",
    reason: "",
    issueDate: "",
  });

  // ===========================
  // Fetch Blood Issues
  // ===========================

  const fetchIssues = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/blood-issues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIssues(res.data.issues);

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Unable to load blood issues."
);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // ===========================
  // Handle Form Input
  // ===========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
    // ===========================
  // Issue Blood
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/blood-issues",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Blood issued successfully.");

      setFormData({
        patientName: "",
        bloodGroup: "",
        units: "",
        reason: "",
        issueDate: "",
      });

      fetchIssues();

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Unable to issue blood."
);
    }
  };

  // ===========================
  // Delete Issue
  // ===========================

  const deleteIssue = async (id) => {

    if (!window.confirm("Delete this blood issue record?"))
      return;

    try {

      await axios.delete(
        `http://localhost:5000/api/blood-issues/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Issue deleted successfully.");

      fetchIssues();

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Unable to delete record."
);
    }
  };

  const generatePDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Blood Issue Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "#",
      "Patient",
      "Blood Group",
      "Units",
      "Reason",
      "Issue Date",
      "Issued By",
    ]],
    body: issues.map((issue, index) => [
      index + 1,
      issue.patientName,
      issue.bloodGroup,
      issue.units,
      issue.reason,
      new Date(issue.issueDate).toLocaleDateString(),
      issue.issuedBy?.name || "-",
    ]),
  });

  doc.text(
    `Total Blood Issues: ${issues.length}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.text(
    `Generated On: ${new Date().toLocaleString()}`,
    14,
    doc.lastAutoTable.finalY + 25
  );

  doc.save("Blood_Issue_Report.pdf");
};
    return (
    <div className="blood-issue-container">

      <div className="page-card">

        <div className="page-heading">

  <div>
    <h2>Blood Issue Management</h2>
    <p>Logged in as: {user?.role}</p>
  </div>

  <div className="page-actions">

    <button
      type="button"
      className="download-btn"
      onClick={generatePDF}
    >
      Download PDF
    </button>

  </div>

</div>

        <form
          className="blood-issue-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleChange}
            required
          />

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
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
            type="number"
            name="units"
            placeholder="Units"
            min="1"
            value={formData.units}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Issue Blood
          </button>

        </form>

        <hr />

        <table className="blood-issue-table">

          <thead>
            <tr>
              <th>Patient</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Reason</th>
              <th>Issue Date</th>
              <th>Issued By</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {issues.length === 0 ? (

              <tr>
                <td colSpan="7">
                  No blood issue records found.
                </td>
              </tr>

            ) : (

              issues.map((issue) => (

                <tr key={issue._id}>

                  <td>{issue.patientName}</td>

                  <td>{issue.bloodGroup}</td>

                  <td>{issue.units}</td>

                  <td>{issue.reason}</td>

                  <td>
                    {new Date(issue.issueDate).toLocaleDateString()}
                  </td>

                  <td>
                    {issue.issuedBy?.name || "-"}
                  </td>

                  <td>

                    {user?.role === "Admin" && (
                      <button
                        type="button"
                        onClick={() => deleteIssue(issue._id)}
                      >
                        Delete
                      </button>
                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default BloodIssue;

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { toast } from "react-toastify";
import "./DonorSchedule.css";

const API_URL =
  "https://blood-management-system-api-7p86.onrender.com/api/donor-schedule";

function DonorSchedule() {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const [donors, setDonors] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    donorName: "",
    bloodType: "",
    contact: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonors(res.data.donors || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error loading schedules."
      );
    }
  };

  useEffect(() => {
    fetchSchedules();
    // Load schedules when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      donorName: "",
      bloodType: "",
      contact: "",
      appointmentDate: "",
      appointmentTime: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Schedule updated successfully.");
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Schedule created successfully.");
      }

      resetForm();
      await fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  const handleEdit = (donor) => {
    setEditingId(donor._id);

    setFormData({
      donorName: donor.donorName || "",
      bloodType: donor.bloodType || "",
      contact: donor.contact || "",
      appointmentDate: donor.appointmentDate
        ? donor.appointmentDate.split("T")[0]
        : "",
      appointmentTime: donor.appointmentTime || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

      toast.success(
        `Donation ${status.toLowerCase()} successfully.`
      );

      await fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update status."
      );
    }
  };

  const deleteSchedule = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this schedule?")
    ) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Schedule deleted successfully.");
      await fetchSchedules();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete schedule."
      );
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Donor Schedule Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [[
        "#",
        "Donor",
        "Blood Group",
        "Date",
        "Time",
        "Contact",
        "Status",
      ]],
      body: donors.map((donor, index) => [
        index + 1,
        donor.donorName,
        donor.bloodType,
        new Date(donor.appointmentDate).toLocaleDateString(),
        donor.appointmentTime,
        donor.contact,
        donor.status,
      ]),
    });

    const finalY = doc.lastAutoTable.finalY;

    doc.text(`Total Schedules: ${donors.length}`, 14, finalY + 15);
    doc.text(
      `Generated On: ${new Date().toLocaleString()}`,
      14,
      finalY + 25
    );

    doc.save("Donor_Schedule_Report.pdf");
  };

  return (
    <div className="donor-schedule-container">
      <div className="page-card donor-schedule-card">
        <div className="page-heading">
          <div>
            <h2>Donor Schedule</h2>
            <p>Logged in as: {user?.role || "User"}</p>
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

        <form className="donor-schedule-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="donorName"
            placeholder="Donor Name"
            value={formData.donorName}
            onChange={handleChange}
            required
          />

          <select
            name="bloodType"
            value={formData.bloodType}
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
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Schedule" : "Create Schedule"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-edit-btn"
              onClick={resetForm}
            >
              Cancel Editing
            </button>
          )}
        </form>

        <hr className="donor-table-divider" />

        <p className="donor-table-hint">
          On mobile, swipe the table horizontally to view all columns.
        </p>

        <div className="donor-table-wrapper">
          <table className="donor-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Blood</th>
                <th>Date</th>
                <th>Time</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {donors.length === 0 ? (
                <tr>
                  <td colSpan="7">No schedules found.</td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor._id}>
                    <td>{donor.donorName}</td>
                    <td>{donor.bloodType}</td>
                    <td>
                      {new Date(
                        donor.appointmentDate
                      ).toLocaleDateString()}
                    </td>
                    <td>{donor.appointmentTime}</td>
                    <td>{donor.contact}</td>
                    <td>
                      <span
                        className={`donor-status ${String(
                          donor.status || "Pending"
                        ).toLowerCase()}`}
                      >
                        {donor.status || "Pending"}
                      </span>
                    </td>
                    <td className="donor-actions-cell">
                      <div className="donor-actions">
                        {donor.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              className="complete-btn"
                              onClick={() =>
                                updateStatus(donor._id, "Completed")
                              }
                            >
                              Complete
                            </button>

                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() =>
                                updateStatus(donor._id, "Cancelled")
                              }
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => handleEdit(donor)}
                            >
                              Edit
                            </button>
                          </>
                        )}

                        {user?.role === "Admin" && (
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => deleteSchedule(donor._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DonorSchedule;

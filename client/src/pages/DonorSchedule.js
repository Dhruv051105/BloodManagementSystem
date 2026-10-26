import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { toast } from "react-toastify";
import "./DonorSchedule.css";

function DonorSchedule() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [donors, setDonors] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    donorName: "",
    bloodType: "",
    contact: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  // ===========================
  // Fetch All Schedules
  // ===========================

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(
        "https://blood-management-system-api-7p86.onrender.com/api/donor-schedule",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDonors(res.data.donors);

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Error loading schedules."
);
    }
  };

  useEffect(() => {
    fetchSchedules();
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
  // Create / Update Schedule
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `https://blood-management-system-api-7p86.onrender.com/api/donor-schedule/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Schedule updated successfully.");
      } else {
        await axios.post(
          "https://blood-management-system-api-7p86.onrender.com/api/donor-schedule",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Schedule created successfully.");
      }

      setFormData({
        donorName: "",
        bloodType: "",
        contact: "",
        appointmentDate: "",
        appointmentTime: "",
      });

      setEditingId(null);

      fetchSchedules();

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Something went wrong."
);
    }
  };

  // ===========================
  // Edit Schedule
  // ===========================

  const handleEdit = (donor) => {
    setEditingId(donor._id);

    setFormData({
      donorName: donor.donorName,
      bloodType: donor.bloodType,
      contact: donor.contact,
      appointmentDate: donor.appointmentDate.split("T")[0],
      appointmentTime: donor.appointmentTime,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // ===========================
// Update Status
// ===========================

const updateStatus = async (id, status) => {
  try {
    await axios.put(
      `https://blood-management-system-api-7p86.onrender.com/api/donor-schedule/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(`Donation ${status.toLowerCase()} successfully.`);
    fetchSchedules();
  } catch (error) {
    toast.error(
  error.response?.data?.message ||
  "Unable to update status."
);
  }
};
// ===========================
// Delete Schedule
// ===========================

const deleteSchedule = async (id) => {
  if (!window.confirm("Are you sure you want to delete this schedule?")) {
    return;
  }

  try {
    await axios.delete(
      `https://blood-management-system-api-7p86.onrender.com/api/donor-schedule/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Schedule deleted successfully.");
    fetchSchedules();
  } catch (error) {
    toast.error(
  error.response?.data?.message ||
  "Unable to delete schedule."
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

  doc.text(
    `Total Schedules: ${donors.length}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.text(
    `Generated On: ${new Date().toLocaleString()}`,
    14,
    doc.lastAutoTable.finalY + 25
  );

  doc.save("Donor_Schedule_Report.pdf");
};
  
    return (
    <div className="donor-schedule-container">

      <div className="page-card">

        <div className="page-heading">

  <div>
    <h2>Donor Schedule</h2>
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
          className="donor-schedule-form"
          onSubmit={handleSubmit}
        >

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

        </form>

        <hr />

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
                <td colSpan="7">
                  No schedules found.
                </td>
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

                  <td>{donor.status}</td>

                  <td>

                    {donor.status === "Pending" && (
                      <>
                        <button
                        type="button"
                          onClick={() =>
                            updateStatus(
                              donor._id,
                              "Completed"
                            )
                          }
                        >
                          Complete
                        </button>

                        <button
                        type="button"
                          onClick={() =>
                            updateStatus(
                              donor._id,
                              "Cancelled"
                            )
                          }
                        >
                          Cancel
                        </button>

                        <button
                        type="button"
                          onClick={() =>
                            handleEdit(donor)
                          }
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {user?.role === "Admin" && (
                      <button
                      type="button"
                        onClick={() =>
                          deleteSchedule(donor._id)
                        }
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

export default DonorSchedule;
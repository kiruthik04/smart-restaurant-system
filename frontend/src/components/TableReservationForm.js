import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createSmartReservation } from "../api/reservationApi";
import "./TableReservationForm.css";

function TableReservationForm() {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    reservationDate: "",
    startTime: "",
    endTime: "",
    numberOfPeople: 1,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setMessage("");
    setLoading(true);

    createSmartReservation(form)
      .then(() => setMessage("✅ Table booked successfully!"))
      .catch((err) => {
        if (err.response) {
          setMessage("❌ " + err.response.data.message);
        } else {
          setMessage("❌ Server error");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="reservation-container">
      <h2>Book a Table</h2>

      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="input-group full-width">
          <label>Customer Name</label>
          <input
            name="customerName"
            placeholder="Enter your name"
            value={form.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group full-width">
          <label>Phone Number</label>
          <input
            name="customerPhone"
            placeholder="Enter phone number"
            value={form.customerPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group full-width">
          <label>Reservation Date</label>
          <input
            type="date"
            name="reservationDate"
            value={form.reservationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group full-width">
          <label>Number of Guests</label>
          <input
            type="number"
            name="numberOfPeople"
            value={form.numberOfPeople}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button
          className="reservation-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Table"}
        </button>
      </form>

      {message && (
        <p className={`reservation-message ${message.startsWith("❌") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default TableReservationForm;
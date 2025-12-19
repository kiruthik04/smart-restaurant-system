import { useState } from "react";
import { createSmartReservation } from "../api/reservationApi";

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <div>
      <h2>Book a Table</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="customerPhone"
          placeholder="Phone Number"
          value={form.customerPhone}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="date"
          name="reservationDate"
          value={form.reservationDate}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="number"
          name="numberOfPeople"
          value={form.numberOfPeople}
          onChange={handleChange}
          min="1"
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Table"}
        </button>

      </form>

      {message && (
        <p className={message.startsWith("❌") ? "error" : "success"}>
          {message}
        </p>
      )}

    </div>
  );
}

export default TableReservationForm;

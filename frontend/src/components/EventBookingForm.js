import { useEffect, useState } from "react";
import { createEventBooking } from "../api/eventApi";
import { getAvailableMenuItems } from "../api/menuApi";
import "./EventBookingForm.css";

function EventBookingForm() {
    const [form, setForm] = useState({
        eventName: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        guestCount: 1,
    });

    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAvailableMenuItems()
            .then((res) => {
                const availableItems = res.data.filter(
                    (item) => item.available
                );
                setMenuItems(availableItems);
            })
            .catch((err) => console.error("MENU LOAD ERROR", err));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const toggleMenuItem = (id) => {
        setSelectedMenuIds((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        if (selectedMenuIds.length === 0) {
            setMessage("❌ Please select at least one menu item");
            return;
        }

        const payload = {
            eventName: form.eventName,
            eventDate: form.eventDate,
            startTime: form.startTime,
            endTime: form.endTime,
            guestCount: Number(form.guestCount),
            menuItemIds: selectedMenuIds,
        };

        setLoading(true);

        createEventBooking(payload)
            .then(() => setMessage("✅ Event booked successfully!"))
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
        <div className="event-booking-container">
            <h2>Book an Event</h2>

            <form
                className="event-booking-form"
                onSubmit={handleSubmit}
            >
                {/* Event Name */}
                <div className="form-group">
                    <label>Event Name</label>
                    <input
                        name="eventName"
                        placeholder="Birthday Party, Wedding..."
                        value={form.eventName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Event Date */}
                <div className="form-group">
                    <label>Event Date</label>
                    <input
                        type="date"
                        name="eventDate"
                        value={form.eventDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Start Time */}
                <div className="form-group">
                    <label>Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* End Time */}
                <div className="form-group">
                    <label>End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Guest Count */}
                <div className="form-group">
                    <label>Number of Guests</label>
                    <input
                        type="number"
                        name="guestCount"
                        value={form.guestCount}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                {/* Menu Selection */}
                <div className="menu-section">
                    <h4>Select Menu Items</h4>

                    <div className="menu-list">
                        {menuItems.map((item) => (
                            <label
                                key={item.id}
                                className="menu-item"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMenuIds.includes(item.id)}
                                    onChange={() => toggleMenuItem(item.id)}
                                />
                                {item.name}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className="event-booking-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Booking..." : "Book Event"}
                </button>
            </form>


            {message && (
                <p
                    className={`event-booking-message ${message.startsWith("❌")
                        ? "error"
                        : "success"
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default EventBookingForm;

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createEventBooking, getAvailableHalls } from "../api/eventApi";
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
    const [availableHalls, setAvailableHalls] = useState([]);
    const [selectedHallId, setSelectedHallId] = useState(null);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [step, setStep] = useState(1); // 1: Details, 2: Hall & Menu
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAvailableMenuItems()
            .then((res) => setMenuItems(res.data.filter(item => item.available)))
            .catch((err) => console.error("MENU LOAD ERROR", err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCheckAvailability = (e) => {
        e.preventDefault();

        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }

        setLoading(true);
        setMessage("");

        const params = {
            date: form.eventDate,
            startTime: form.startTime,
            endTime: form.endTime,
            guests: form.guestCount,
        };

        getAvailableHalls(params)
            .then((res) => {
                setAvailableHalls(res.data);
                setStep(2);
            })
            .catch((err) => setMessage("❌ " + (err.response?.data?.message || "No halls available for this time")))
            .finally(() => setLoading(false));
    };

    const toggleMenuItem = (id) => {
        setSelectedMenuIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        if (!selectedHallId) return setMessage("❌ Please select a hall");
        if (selectedMenuIds.length === 0) return setMessage("❌ Please select at least one menu item");

        const payload = {
            ...form,
            hallId: selectedHallId,
            menuItemIds: selectedMenuIds,
        };

        setLoading(true);
        createEventBooking(payload)
            .then(() => {
                setMessage("✅ Event booked successfully!");
                setStep(1);
                setForm({ eventName: "", eventDate: "", startTime: "", endTime: "", guestCount: 1 });
                setSelectedHallId(null);
                setSelectedMenuIds([]);
            })
            .catch((err) => setMessage("❌ " + (err.response?.data?.message || "Booking failed")))
            .finally(() => setLoading(false));
    };

    return (
        <div className="event-booking-container">
            <h2>Book an Event</h2>

            <form className="event-booking-form" onSubmit={step === 1 ? handleCheckAvailability : handleFinalSubmit}>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Event Name *</label>
                        <input name="eventName" value={form.eventName} onChange={handleChange} required disabled={step === 2} />
                    </div>
                    <div className="form-group">
                        <label>Event Date *</label>
                        <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required disabled={step === 2} />
                    </div>
                    <div className="form-group">
                        <label>Number of Guests *</label>
                        <input type="number" name="guestCount" value={form.guestCount} onChange={handleChange} min="1" required disabled={step === 2} />
                    </div>
                    <div className="form-group">
                        <label>Start Time *</label>
                        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required disabled={step === 2} />
                    </div>
                    <div className="form-group">
                        <label>End Time *</label>
                        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required disabled={step === 2} />
                    </div>
                </div>

                {step === 1 && (
                    <button className="primary-btn" type="submit" disabled={loading}>
                        {loading ? "Checking Halls..." : "Check Availability"}
                    </button>
                )}

                {step === 2 && (
                    <div className="selection-step fade-in">
                        <hr />
                        <h3>Step 2: Select Hall & Menu</h3>

                        <div className="hall-section">
                            <h4>Available Halls</h4>
                            <div className="hall-grid">
                                {availableHalls.length > 0 ? (
                                    availableHalls.map((hall, index) => (
                                        <div key={hall.id || index}
                                            className={`hall-card ${selectedHallId === hall.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedHallId(hall.id)}
                                        >
                                            <h5>{hall.name}</h5>
                                            <p>Capacity: {hall.capacity}</p>
                                        </div>
                                    ))
                                ) : <p>No halls available for this criteria.</p>}
                            </div>
                        </div>

                        <div className="menu-selection-section">
                            <h4>Select Menu Items</h4>
                            <div className="menu-chip-grid">
                                {menuItems.map((item, index) => (
                                    <label key={item.id || index} className={`menu-chip ${selectedMenuIds.includes(item.id) ? 'active' : ''}`}>
                                        <input type="checkbox" checked={selectedMenuIds.includes(item.id)} onChange={() => toggleMenuItem(item.id)} />
                                        {item.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button type="button" className="secondary-btn" onClick={() => setStep(1)}>Back to Details</button>
                            <button className="primary-btn" type="submit" disabled={loading}>
                                {loading ? "Booking..." : "Confirm Event Booking"}
                            </button>
                        </div>
                    </div>
                )}
            </form>

            {message && <p className={`message-box ${message.startsWith("✅") ? "success" : "error"}`}>{message}</p>}
        </div>
    );
}

export default EventBookingForm;
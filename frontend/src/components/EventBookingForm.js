import { useEffect, useState } from "react";
import { createEventBooking } from "../api/eventApi";
import { getAvailableMenuItems } from "../api/menuApi";

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

    // ✅ LOAD MENU ITEMS ON COMPONENT LOAD
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

    // ✅ TOGGLE CHECKBOX
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
        <div>
            <h2>Book an Event</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="eventName"
                    placeholder="Event Name"
                    value={form.eventName}
                    onChange={handleChange}
                    required
                />
                <br />

                <input
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
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
                    name="guestCount"
                    value={form.guestCount}
                    onChange={handleChange}
                    min="1"
                    required
                />
                <br />

                <h4>Select Menu Items</h4>

                {menuItems.map((item) => (
                    <div key={item.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedMenuIds.includes(item.id)}
                                onChange={() => toggleMenuItem(item.id)}
                            />
                            {item.name}
                        </label>
                    </div>
                ))}

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Booking..." : "Book Event"}
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

export default EventBookingForm;

import { useEffect, useState } from "react";
import {
    getAllEvents,
    approveEvent,
    cancelEvent,
    createEventHall
} from "../api/adminEventApi";
import "./AdminEventPage.css";
import LoadingSpinner from "../components/LoadingSpinner";

function AdminEventPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");



    const fetchEvents = () => {
        setLoading(true);
        getAllEvents()
            .then((res) => {
                setEvents(res.data);
                // Refresh modal data if it's currently open
                if (selectedEvent) {
                    const updated = res.data.find(e => e.id === selectedEvent.id);
                    if (updated) setSelectedEvent(updated);
                }
            })
            .catch(() => setMessage("❌ Failed to load events"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApprove = async (id) => {
        try {
            await approveEvent(id);
            setMessage("✅ Event approved successfully");
            fetchEvents();
            setSelectedEvent(null);
        } catch (err) {
            setMessage(err.response?.data?.message || "❌ Failed to approve event");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await cancelEvent(id);
            setMessage("✅ Event cancelled");
            fetchEvents();
            setSelectedEvent(null);
        } catch (err) {
            setMessage(err.response?.data?.message || "❌ Failed to cancel event");
        }
    };



    if (loading && events.length === 0) return <LoadingSpinner />;

    return (
        <div className="admin-event-page">
            <div className="admin-page-header">
                <h2>Admin – Event Management</h2>
            </div>

            {message && (
                <div className="admin-message-banner" onClick={() => setMessage("")}>
                    {message}
                </div>
            )}

            <div className="event-table-wrapper">
                <table className="admin-event-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.id}</td>
                                    <td>{event.eventName}</td>
                                    <td>{event.eventDate}</td>
                                    <td>{event.guestCount}</td>
                                    <td>
                                        <span className={`status-badge ${event.status.toLowerCase()}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No event bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL FOR EVENT DETAILS */}
            {selectedEvent && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="event-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedEvent.eventName}</h3>
                            <button className="close-modal" onClick={() => setSelectedEvent(null)}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-grid">
                                <p><strong>Date:</strong> {selectedEvent.eventDate}</p>
                                <p><strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                                <p><strong>Guests:</strong> {selectedEvent.guestCount}</p>
                                <p><strong>Status:</strong> <span className={`status-badge ${selectedEvent.status.toLowerCase()}`}>{selectedEvent.status}</span></p>
                            </div>

                            <h4>Selected Menu</h4>
                            <ul className="modal-menu-list">
                                {selectedEvent.menuItems && selectedEvent.menuItems.length > 0 ? (
                                    selectedEvent.menuItems.map((item) => (
                                        <li key={item.id}>{item.name}</li>
                                    ))
                                ) : (
                                    <li>No items selected</li>
                                )}
                            </ul>
                        </div>

                        <div className="modal-footer">
                            {selectedEvent.status === "PENDING" && (
                                <button
                                    className="approve-btn"
                                    onClick={() => handleApprove(selectedEvent.id)}
                                >
                                    Approve Booking
                                </button>
                            )}
                            {(selectedEvent.status !== "CANCELLED" && selectedEvent.status !== "COMPLETED") && (
                                <button
                                    className="cancel-btn"
                                    onClick={() => handleCancel(selectedEvent.id)}
                                >
                                    Cancel Event
                                </button>
                            )}
                            <button className="secondary-btn" onClick={() => setSelectedEvent(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

export default AdminEventPage;
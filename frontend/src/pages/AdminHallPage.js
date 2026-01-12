import { useEffect, useState } from "react";
import {
    createEventHall,
    getEventHalls,
    updateEventHall,
    deleteEventHall
} from "../api/adminEventApi";
import "./AdminHallPage.css"; // Dedicated styles
import LoadingSpinner from "../components/LoadingSpinner";

function AdminHallPage() {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [hallName, setHallName] = useState("");
    const [hallCapacity, setHallCapacity] = useState("");

    const fetchHalls = () => {
        setLoading(true);
        getEventHalls()
            .then((res) => setHalls(res.data))
            .catch(() => setMessage("❌ Failed to load halls"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchHalls();
    }, []);

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setHallName("");
        setHallCapacity("");
        setShowModal(true);
    };

    const openEditModal = (hall) => {
        setIsEditing(true);
        setCurrentId(hall.id);
        setHallName(hall.name);
        setHallCapacity(hall.capacity);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hall?")) return;
        try {
            await deleteEventHall(id);
            setMessage("✅ Hall deleted successfully");
            fetchHalls();
        } catch (err) {
            setMessage("❌ Failed to delete hall");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hallName || !hallCapacity) {
            alert("Please fill in all fields");
            return;
        }

        const hallData = {
            name: hallName,
            capacity: parseInt(hallCapacity),
            active: true // default active
        };

        try {
            if (isEditing) {
                await updateEventHall(currentId, hallData);
                setMessage("✅ Hall updated successfully");
            } else {
                await createEventHall(hallData);
                setMessage("✅ Hall created successfully");
            }
            setShowModal(false);
            fetchHalls();
        } catch (err) {
            console.error(err);
            setMessage(`❌ Failed to ${isEditing ? 'update' : 'create'} hall`);
        }
    };

    if (loading && halls.length === 0) return <LoadingSpinner />;

    return (
        <div className="admin-hall-page">
            <div className="admin-page-header">
                <h2>Admin – Hall Management</h2>
                <button
                    className="create-hall-btn"
                    onClick={openCreateModal}
                >
                    + Create Hall
                </button>
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
                            <th>Hall Name</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {halls.length > 0 ? (
                            halls.map((hall) => (
                                <tr key={hall.id}>
                                    <td>{hall.id}</td>
                                    <td>{hall.name}</td>
                                    <td>{hall.capacity}</td>
                                    <td>
                                        <span className={`status-badge ${hall.active ? 'approved' : 'cancelled'}`}>
                                            {hall.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => openEditModal(hall)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            onClick={() => handleDelete(hall.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                                    No halls found. Create one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="event-modal narrow-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{isEditing ? "Edit Hall" : "Create New Hall"}</h3>
                            <button className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Hall Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={hallName}
                                        onChange={(e) => setHallName(e.target.value)}
                                        placeholder="e.g. Grand Ballroom"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginTop: '15px' }}>
                                    <label>Capacity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={hallCapacity}
                                        onChange={(e) => setHallCapacity(e.target.value)}
                                        placeholder="Max guests"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="approve-btn">
                                    {isEditing ? "Update Hall" : "Create Hall"}
                                </button>
                                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminHallPage;

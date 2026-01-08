import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminStaffPage.css";

function AdminStaffPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        role: "KITCHEN" // Default to KITCHEN as requested
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Simple validation
        if (!formData.username || !formData.password || !formData.name) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const res = await register(formData);

        if (res.success) {
            setSuccess(`Staff member '${formData.name}' registered successfully!`);
            // Reset form (keep role as KITCHEN)
            setFormData({
                username: "",
                password: "",
                name: "",
                role: "KITCHEN"
            });
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="admin-staff-page">
            <div className="staff-header">
                <h2>Manage Staff</h2>
                <p>Register new staff members for the Kitchen.</p>
            </div>

            <div className="staff-content">
                <div className="card register-card">
                    <h3>Register New Staff</h3>
                    {error && <div className="alert error">{error}</div>}
                    {success && <div className="alert success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="e.g. kitchen_staff_1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter strong password"
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} disabled>
                                <option value="KITCHEN">Kitchen Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <small className="hint">Currently restricted to creating Kitchen Staff.</small>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Registering..." : "Register Staff"}
                        </button>
                    </form>
                </div>

                {/* Placeholder for Staff List - could be added later */}
                <div className="card info-card">
                    <h3>Staff Management Tips</h3>
                    <ul>
                        <li>Create unique usernames for each staff member.</li>
                        <li>Kitchen staff will only have access to the Kitchen Order View.</li>
                        <li>Passwords should be at least 6 characters long.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminStaffPage;

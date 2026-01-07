import { useEffect, useState } from "react";
import {
    getMenu,
    deleteMenuItem,
    toggleAvailability,
} from "./../api/adminMenuApi";
import { useNavigate } from "react-router-dom";
import "./AdminMenuPage.css";

function AdminMenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const loadMenu = async () => {
        setLoading(true);
        const res = await getMenu();
        setMenu(res.data);
        setLoading(false);
    };

    useEffect(() => {
        loadMenu();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        await deleteMenuItem(id);
        loadMenu();
    };

    const handleToggle = async (id) => {
        await toggleAvailability(id);
        loadMenu();
    };

    if (loading) return <p>Loading menu...</p>;

    return (
        <div className="admin-menu-page">
            <div className="admin-menu-header">
                <h2>Menu Management</h2>

                <button
                    className="add-btn"
                    onClick={() => navigate("/admin/menu/add")}
                >
                    ➕ Add Menu Item
                </button>
            </div>

            <table className="menu-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {menu.map((item) => (
                        <tr key={item.id}>
                            <td data-label="Name">{item.name}</td>
                            <td data-label="Category">{item.category}</td>
                            <td data-label="Price">{item.price}</td>
                            <td data-label="Status">
                                <span className={item.available ? "status-active" : "status-inactive"}>
                                    {item.available ? "Available" : "Unavailable"}
                                </span>
                            </td>
                            <td data-label="Actions" className="actions">
                                {/* buttons here */}
                                <button onClick={() => handleToggle(item.id)}>
                                    Toggle
                                </button>
                                <button className="danger" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminMenuPage;

import { useEffect, useState } from "react";
import {
    getMenu,
    deleteMenuItem,
    toggleAvailability,
    updateMenuItem
} from "./../api/adminMenuApi";
import { useNavigate } from "react-router-dom";
import "./AdminMenuPage.css";

function AdminMenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Edit Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "" // Assuming description exists in model
    });

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

    // Open Edit Modal
    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description || ""
        });
        setShowModal(true);
    };

    // Submit Edit
    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingItem) return;

        const data = new FormData();
        data.append("name", formData.name);
        data.append("category", formData.category);
        data.append("price", formData.price);
        data.append("description", formData.description);
        data.append("available", editingItem.available);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            await updateMenuItem(editingItem.id, data);
            setShowModal(false);
            setEditingItem(null);
            loadMenu(); // Refresh list
        } catch (error) {
            console.error("Failed to update item", error);
            alert("Failed to update item");
        }
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
                        <th>Image</th>
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
                            <td>
                                <img
                                    src={`/api/menu/${item.id}/image`}
                                    alt={item.name}
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </td>
                            <td data-label="Name" style={{ fontWeight: 'bold' }}>{item.name}</td>
                            <td data-label="Category">{item.category}</td>
                            <td data-label="Price">₹{item.price}</td>
                            <td data-label="Status">
                                <span className={item.available ? "status-active" : "status-inactive"}>
                                    {item.available ? "Available" : "Unavailable"}
                                </span>
                            </td>
                            <td data-label="Actions" className="actions">
                                <button className="edit-btn" onClick={() => handleEdit(item)}>
                                    Edit
                                </button>
                                <button
                                    className={item.available ? "toggle-btn disable" : "toggle-btn enable"}
                                    onClick={() => handleToggle(item.id)}
                                >
                                    {item.available ? "Disable" : "Enable"}
                                </button>
                                <button className="danger" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* EDIT MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Menu Item</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Change Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminMenuPage;

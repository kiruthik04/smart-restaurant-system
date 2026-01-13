import { useState } from "react";
import { addMenuItem } from "../api/adminMenuApi";
import { useNavigate } from "react-router-dom";
import "./AddMenuPage.css";

function AddMenuPage() {
    const navigate = useNavigate();

    const [item, setItem] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        available: true,
    });
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItem({
            ...item,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!item.name || !item.category || !item.price) {
            alert("Name, Category and Price are required");
            return;
        }

        const formData = new FormData();
        formData.append("name", item.name);
        formData.append("category", item.category);
        formData.append("description", item.description);
        formData.append("price", item.price);
        formData.append("available", item.available);
        if (image) {
            formData.append("image", image);
        }

        try {
            await addMenuItem(formData);
            navigate("/admin/menu");
        } catch (error) {
            console.error("Failed to add menu item", error);
            alert("Failed to add menu item");
        }
    };

    return (
        <div className="add-menu-page">
            <h2>Add Menu Item</h2>

            <form onSubmit={handleSubmit} className="menu-form">
                <input
                    name="name"
                    placeholder="Name"
                    value={item.name}
                    onChange={handleChange}
                    required
                />

                <select
                    name="category"
                    value={item.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Starter">Starter</option>
                    <option value="Main">Main</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drinks">Drinks</option>
                </select>

                <textarea
                    name="description"
                    placeholder="Description"
                    value={item.description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={handleChange}
                    required
                />

                <div className="form-group">
                    <label>Image</label>
                    <input type="file" onChange={handleFileChange} />
                </div>

                <label className="checkbox">
                    <input
                        type="checkbox"
                        name="available"
                        checked={item.available}
                        onChange={handleChange}
                    />
                    Available
                </label>

                <div className="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => navigate("/admin/menu")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddMenuPage;

import { useEffect, useState } from "react";
import {
    getAllTables,
    forceReleaseTable,
    createTable,
    disableTable,
    enableTable
} from "../api/adminTableApi";
import "./AdminTablePage.css";
import LoadingSpinner from "../components/LoadingSpinner";

function AdminTablePage() {

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [capacity, setCapacity] = useState("");

    const handleCreateTable = async () => {
        if (!tableNumber || !capacity) {
            setMessage("Table number and capacity are required");
            return;
        }

        try {
            await createTable({
                tableNumber: Number(tableNumber),
                capacity: Number(capacity)
            });

            setMessage("Table added successfully");
            setTableNumber("");
            setCapacity("");
            fetchTables(); // refresh list

        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to add table");
        }
    };
    const handleDisable = async (tableId) => {
        const confirm = window.confirm(
            "Disable this table? It will not be available for customers."
        );
        if (!confirm) return;

        try {
            await disableTable(tableId);
            setMessage("Table disabled successfully");
            fetchTables();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to disable table");
        }
    };

    const handleEnable = async (tableId) => {
        try {
            await enableTable(tableId);
            setMessage("Table enabled successfully");
            fetchTables();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to enable table");
        }
    };

    const fetchTables = () => {
        setLoading(true);
        getAllTables()
            .then(res => setTables(res.data))
            .catch(() => setMessage("Failed to load tables"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTables();
    }, []);



    const handleRelease = async (tableId) => {
        const confirm = window.confirm(
            "Force release this table? This will free it for new customers."
        );
        if (!confirm) return;

        try {
            await forceReleaseTable(tableId);
            setMessage("Table released successfully");
            fetchTables(); // refresh state
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to release table");
        }
    };

    if (loading && tables.length === 0) return <LoadingSpinner />;

    return (
        <div className="admin-table-page">
            <h2>Admin – Table Management</h2>

            {message && <p className="admin-message">{message}</p>}

            <h3>Add New Table</h3>

            <div className="add-table-form">
                <input
                    type="number"
                    placeholder="Table Number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />

                <button onClick={handleCreateTable}>
                    Add Table
                </button>
            </div>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Table</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Enabled</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tables.map(table => (
                            <tr key={table.id}>
                                <td>{table.tableNumber}</td>
                                <td>{table.capacity}</td>

                                <td>
                                    {!table.enabled && (
                                        <span className="status-disabled">DISABLED</span>
                                    )}
                                    {table.enabled && table.inUse && (
                                        <span className="status-inuse">IN USE</span>
                                    )}
                                    {table.enabled && !table.inUse && (
                                        <span className="status-free">FREE</span>
                                    )}
                                </td>

                                <td>{table.enabled ? "YES" : "NO"}</td>

                                <td>
                                    {table.inUse && (
                                        <button
                                            className="action-btn btn-release"
                                            onClick={() => handleRelease(table.id)}
                                        >
                                            Release
                                        </button>
                                    )}

                                    {table.enabled && !table.inUse && (
                                        <button
                                            className="action-btn btn-disable"
                                            onClick={() => handleDisable(table.id)}
                                        >
                                            Disable
                                        </button>
                                    )}

                                    {!table.enabled && (
                                        <button
                                            className="action-btn btn-enable"
                                            onClick={() => handleEnable(table.id)}
                                        >
                                            Enable
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTablePage;

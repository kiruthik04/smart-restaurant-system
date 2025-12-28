import { useEffect, useState } from "react";
import { getAllTables, forceReleaseTable, createTable } from "../api/adminTableApi";

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

    const fetchTables = () => {
        setLoading(true);
        getAllTables()
            .then(res => setTables(res.data))
            .catch(() => setMessage("Failed to load tables"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTables(); // initial load

        const interval = setInterval(() => {
            fetchTables();
        }, 5000); // 5 seconds

        return () => clearInterval(interval); // cleanup
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

    return (
        <div style={{ padding: "20px" }}>
            <h2>Admin – Table Management</h2>

            {message && <p>{message}</p>}
            {loading && <p>Loading tables...</p>}
            <h3>Add New Table</h3>

            <div style={{ marginBottom: "15px" }}>
                <input
                    type="number"
                    placeholder="Table Number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    style={{ marginRight: "10px" }}
                />

                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    style={{ marginRight: "10px" }}
                />

                <button onClick={handleCreateTable}>
                    Add Table
                </button>
            </div>

            <table
                border="1"
                cellPadding="10"
                cellSpacing="0"
                style={{ width: "100%", marginTop: "10px" }}
            >
                <thead>
                    <tr>
                        <th>Table</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {tables.map(table => (
                        <tr key={table.id}>
                            <td>{table.tableNumber}</td>
                            <td>{table.capacity}</td>

                            <td>
                                {table.inUse ? (
                                    <span style={{ color: "red", fontWeight: "bold" }}>
                                        IN USE
                                    </span>
                                ) : (
                                    <span style={{ color: "green", fontWeight: "bold" }}>
                                        FREE
                                    </span>
                                )}
                            </td>

                            <td>
                                {table.inUse ? (
                                    <button
                                        onClick={() => handleRelease(table.id)}
                                        style={{
                                            backgroundColor: "#d9534f",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 10px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Force Release
                                    </button>
                                ) : (
                                    "—"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminTablePage;

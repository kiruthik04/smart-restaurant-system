import { useEffect, useState } from "react";
import {
    getAllTables,
    forceReleaseTable,
    createTable,
    disableTable,
    enableTable
} from "../api/adminTableApi";
import "./AdminTablePage.css";
import html2canvas from 'html2canvas';

import { QRCodeCanvas } from "qrcode.react";

// Update QRCodeCanvas value to full URL
const DEPLOYED_URL = "https://smartrestro.vercel.app";

function AdminTablePage() {

    const [tables, setTables] = useState([]);
    // Removed unused loading/message states to fix ESLint
    const [tableNumber, setTableNumber] = useState("");
    const [capacity, setCapacity] = useState("");

    // QR Modal State
    const [selectedQR, setSelectedQR] = useState(null); // { tableNumber, tableCode }

    const handleShowQR = (table) => {
        setSelectedQR({
            tableNumber: table.tableNumber,
            tableCode: table.tableCode
        });
    };

    const handleCreateTable = async () => {
        if (!tableNumber || !capacity) {
            alert("Table number and capacity are required");
            return;
        }

        try {
            await createTable({
                tableNumber: Number(tableNumber),
                capacity: Number(capacity)
            });

            alert("Table added successfully");
            setTableNumber("");
            setCapacity("");
            fetchTables(); // refresh list

        } catch (err) {
            alert(err.response?.data?.message || "Failed to add table");
        }
    };
    const handleDisable = async (tableId) => {
        const confirm = window.confirm(
            "Disable this table? It will not be available for customers."
        );
        if (!confirm) return;

        try {
            await disableTable(tableId);
            alert("Table disabled successfully");
            fetchTables();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to disable table");
        }
    };

    const handleEnable = async (tableId) => {
        try {
            await enableTable(tableId);
            alert("Table enabled successfully");
            fetchTables();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to enable table");
        }
    };

    const fetchTables = () => {
        getAllTables()
            .then(res => setTables(res.data))
            .catch(() => console.error("Failed to load tables"));
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
            alert("Table released successfully");
            fetchTables(); // refresh state
        } catch (err) {
            alert(err.response?.data?.message || "Failed to release table");
        }
    };

    const handleDownloadCard = async () => {
        const element = document.getElementById('qr-card-template');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Higher resolution
                useCORS: true,
                backgroundColor: null
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `Table-${selectedQR.tableNumber}-QR.png`;
            link.click();
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download card");
        }
    };

    return (
        <div className="admin-table-page">
            {/* ... header ... */}

            {/* Hidden Printable Card Template */}
            {selectedQR && (
                <div id="qr-card-template" className="qr-card-template">
                    <div className="card-header">
                        <h1>Love, Rosie</h1>
                        <p>PREMIUM CAFE</p>
                    </div>

                    <div className="card-body">
                        <div className="card-qr-section">
                            <QRCodeCanvas
                                value={`${DEPLOYED_URL}/order?code=${selectedQR.tableCode}`}
                                size={250}
                                level={"H"}
                                includeMargin={false}
                                bgColor={"#ffffff"}
                                fgColor={"#2D3436"}
                            />
                        </div>
                        <div className="card-info-section">
                            <span className="info-label">TABLE NO</span>
                            <span className="info-number">{selectedQR.tableNumber}</span>
                            <span className="info-code-label">ACCESS CODE</span>
                            <span className="info-code">{selectedQR.tableCode}</span>
                        </div>
                    </div>

                    <div className="card-footer">
                        <p>Scan to Order & Pay</p>
                    </div>
                </div>
            )}

            {/* ... existing modal ... */}
            {selectedQR && (
                <div className="modal-overlay" onClick={() => setSelectedQR(null)}>
                    <div className="modal-content qr-modal" onClick={e => e.stopPropagation()}>
                        <h3>Table {selectedQR.tableNumber} QR Code</h3>
                        <p>Scan this to order securely</p>

                        <div className="qr-container">
                            <QRCodeCanvas
                                value={`${DEPLOYED_URL}/order?code=${selectedQR.tableCode}`}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>

                        <p className="qr-code-text">Code: <strong>{selectedQR.tableCode}</strong></p>

                        <div className="modal-actions">
                            <button className="download-btn" onClick={handleDownloadCard}>
                                Download Card
                            </button>
                            <button className="close-btn" onClick={() => setSelectedQR(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ... rest of render ... */}

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
                            <th>Code</th>
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
                                <td><code className="table-code-preview">{table.tableCode}</code></td>
                                <td>{table.capacity}</td>

                                <td>
                                    {!table.enabled && (
                                        <span className="status-disabled">DISABLED</span>
                                    )}
                                    {table.enabled && table.active && (
                                        <span className="status-inuse">IN USE</span>
                                    )}
                                    {table.enabled && !table.active && (
                                        <span className="status-free">FREE</span>
                                    )}
                                </td>

                                <td>{table.enabled ? "YES" : "NO"}</td>

                                <td>
                                    <button
                                        className="action-btn btn-qr"
                                        onClick={() => handleShowQR(table)}
                                    >
                                        QR
                                    </button>

                                    {table.active && (
                                        <button
                                            className="action-btn btn-release"
                                            onClick={() => handleRelease(table.id)}
                                        >
                                            Release
                                        </button>
                                    )}

                                    {table.enabled && !table.active && (
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

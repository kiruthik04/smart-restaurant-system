import { useEffect, useState } from "react";
import { getKitchenOrders } from "../api/kitchenOrderApi";
import "./AdminKitchenPage.css";
import LoadingSpinner from "../components/LoadingSpinner";

function AdminKitchenPage() {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = (showLoading = false) => {
            if (showLoading) setLoading(true);
            getKitchenOrders()
                .then(res => setOrders(res.data))
                .catch(() => setMessage("Failed to load kitchen orders"))
                .finally(() => {
                    if (showLoading) setLoading(false);
                });
        };

        // Initial load
        fetchOrders(true);

        // Poll every 10s
        const interval = setInterval(() => {
            fetchOrders(false);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading && orders.length === 0) return <LoadingSpinner />;

    return (
        <div className="admin-kitchen-page">
            <h2>Kitchen – Orders Queue</h2>

            {message && (
                <div className="kitchen-message-banner" onClick={() => setMessage("")}>
                    {message}
                </div>
            )}

            {/* {loading && orders.length === 0 && <p className="kitchen-loading">Loading...</p>} */}

            <div className="kitchen-grid">
                {orders.length === 0 && !loading ? (
                    <p className="kitchen-empty">No pending orders 🎉</p>
                ) : (
                    orders.map(order => (
                        <div key={order.orderId} className={`order-card ${order.status.toLowerCase()}`}>
                            <div className="card-header">
                                <h3>Order #{order.orderId}</h3>
                                <span className="table-badge">Table {order.tableNumber}</span>
                            </div>

                            <ul className="order-items-list">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="kitchen-item">
                                        {item.quantity} × {item.name}
                                    </li>
                                ))}
                            </ul>

                            <div className="card-footer-status">
                                <span className={`status-text ${order.status.toLowerCase()}`}>
                                    {order.status === "CREATED" ? "🕒 Waiting" : "🔥 In Progress"}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminKitchenPage;
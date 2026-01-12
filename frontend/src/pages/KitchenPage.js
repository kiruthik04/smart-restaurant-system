import { useEffect, useState } from "react";
import {
    getKitchenOrders,
    startOrder,
    completeOrder
} from "../api/kitchenOrderApi";
import "./KitchenPage.css";

function KitchenPage() {

    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        getKitchenOrders()
            .then(res => setOrders(res.data))
            .catch(() => setMessage("Failed to load kitchen orders"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStart = async (orderId) => {
        try {
            await startOrder(orderId);
            fetchOrders();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to start order");
        }
    };

    const handleComplete = async (orderId) => {
        try {
            await completeOrder(orderId);
            fetchOrders();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to complete order");
        }
    };

    return (
        <div className="kitchen-page">
            <h2>Kitchen – Orders Queue</h2>

            {message && (
                <p className="kitchen-message">{message}</p>
            )}

            {loading && (
                <p className="kitchen-loading">Loading orders...</p>
            )}

            {orders.length === 0 && !loading && (
                <p className="kitchen-empty">No pending orders 🎉</p>
            )}

            {orders.map(order => (
                <div key={order.orderId} className={`kds-card ${order.status.toLowerCase()}`}>
                    {/* Header: Table & Time/ID */}
                    <div className="kds-card-header">
                        <div className="kds-table-badge">T-{order.tableNumber}</div>
                        <div className="kds-order-id">#{order.orderId}</div>
                    </div>

                    {/* Body: Items List */}
                    <div className="kds-card-body">
                        <div className="kds-status-badge">{order.status.replace("_", " ")}</div>
                        <ul className="kds-items-list">
                            {order.items.map((item, idx) => (
                                <li key={idx}>
                                    <span className="qty">{item.quantity}x</span> {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer: Action Button */}
                    <div className="kds-card-footer">
                        {order.status === "CREATED" && (
                            <button
                                className="kds-btn start-btn"
                                onClick={() => handleStart(order.orderId)}
                            >
                                Start Cooking
                            </button>
                        )}

                        {order.status === "IN_PROGRESS" && (
                            <button
                                className="kds-btn ready-btn"
                                onClick={() => handleComplete(order.orderId)}
                            >
                                Mark Ready
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KitchenPage;

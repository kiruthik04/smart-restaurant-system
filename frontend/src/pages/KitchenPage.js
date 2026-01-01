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
                <div key={order.orderId} className="order-card">
                    <h3>Order #{order.orderId}</h3>

                    <div className="order-meta">
                        <p><b>Table:</b> {order.tableNumber}</p>
                        <p>
                            <b>Status:</b>{" "}
                            <span
                                className={`order-status ${order.status === "CREATED"
                                    ? "status-created"
                                    : "status-progress"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </p>
                    </div>

                    <ul className="order-items">
                        {order.items.map((item, idx) => (
                            <li key={idx}>
                                {item.name} × {item.quantity}
                            </li>
                        ))}
                    </ul>

                    {order.status === "CREATED" && (
                        <button
                            className="kitchen-btn start"
                            onClick={() => handleStart(order.orderId)}
                        >
                            Start Cooking
                        </button>
                    )}

                    {order.status === "IN_PROGRESS" && (
                        <button
                            className="kitchen-btn ready"
                            onClick={() => handleComplete(order.orderId)}
                        >
                            Mark Ready
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default KitchenPage;

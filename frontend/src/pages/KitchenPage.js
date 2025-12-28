import { useEffect, useState } from "react";
import {
    getKitchenOrders,
    startOrder,
    completeOrder
} from "../api/kitchenOrderApi";

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

        // optional polling every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
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
        <div style={{ padding: "20px" }}>
            <h2>Kitchen – Orders Queue</h2>

            {message && <p>{message}</p>}
            {loading && <p>Loading orders...</p>}

            {orders.length === 0 && <p>No pending orders 🎉</p>}

            {orders.map(order => (
                <div
                    key={order.orderId}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "10px"
                    }}
                >
                    <h3>Order #{order.orderId}</h3>
                    <p><b>Table:</b> {order.tableNumber}</p>
                    <p><b>Status:</b> {order.status}</p>

                    <ul>
                        {order.items.map((item, idx) => (
                            <li key={idx}>
                                {item.name} × {item.quantity}
                            </li>
                        ))}
                    </ul>

                    {order.status === "CREATED" && (
                        <button
                            onClick={() => handleStart(order.orderId)}
                            style={{
                                backgroundColor: "#0275d8",
                                color: "white",
                                border: "none",
                                padding: "8px 12px",
                                cursor: "pointer"
                            }}
                        >
                            Start Cooking
                        </button>
                    )}

                    {order.status === "IN_PROGRESS" && (
                        <button
                            onClick={() => handleComplete(order.orderId)}
                            style={{
                                backgroundColor: "#5cb85c",
                                color: "white",
                                border: "none",
                                padding: "8px 12px",
                                cursor: "pointer"
                            }}
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

import { useEffect, useState } from "react";
import {
    getAllOrders,
    getOrderById,
    completeOrder
} from "../api/adminOrderApi";

function AdminOrderPage() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchOrders = () => {
        setLoading(true);

        getAllOrders()
            .then(res => {
                setOrders(res.data);

                // 🔄 refresh selected order details if open
                if (selectedOrder) {
                    const updated = res.data.find(
                        o => o.orderId === selectedOrder.orderId
                    );
                    if (updated) {
                        getOrderById(updated.orderId)
                            .then(r => setSelectedOrder(r.data));
                    }
                }
            })
            .catch(() => setMessage("Failed to load orders"))
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        fetchOrders(); // initial load

        const interval = setInterval(() => {
            fetchOrders();
        }, 5000); // 5 seconds

        return () => clearInterval(interval); // cleanup
    }, []);


    const viewOrder = (orderId) => {
        getOrderById(orderId)
            .then(res => setSelectedOrder(res.data))
            .catch(() => setMessage("Failed to load order details"));
    };

    const markCompleted = async (orderId) => {
        const confirm = window.confirm("Mark this order as completed?");
        if (!confirm) return;

        try {
            await completeOrder(orderId);
            setMessage("Order marked as completed");
            setSelectedOrder(null);
            fetchOrders();
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to complete order");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Admin – Order Management</h2>

            {message && <p>{message}</p>}
            {loading && <p>Loading orders...</p>}

            {/* Orders List */}
            <table
                border="1"
                cellPadding="10"
                cellSpacing="0"
                style={{ width: "100%", marginTop: "10px" }}
            >
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Table</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{order.tableNumber}</td>
                            <td>₹{order.totalAmount}</td>
                            <td>
                                {order.status === "CREATED" && (
                                    <span style={{ color: "orange", fontWeight: "bold" }}>
                                        Waiting for Kitchen
                                    </span>
                                )}

                                {order.status === "IN_PROGRESS" && (
                                    <span style={{ color: "#0275d8", fontWeight: "bold" }}>
                                        Being Cooked
                                    </span>
                                )}

                                {order.status === "COMPLETED" && (
                                    <span style={{ color: "green", fontWeight: "bold" }}>
                                        Done
                                    </span>
                                )}
                            </td>

                            <td>
                                <button onClick={() => viewOrder(order.orderId)}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Order Details */}
            {selectedOrder && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        border: "1px solid #ccc"
                    }}
                >
                    <h3>Order #{selectedOrder.orderId}</h3>
                    <p><b>Table:</b> {selectedOrder.tableNumber}</p>
                    <p><b>Status:</b> {selectedOrder.status}</p>

                    <h4>Items</h4>
                    <ul>
                        {selectedOrder.items.map((item, idx) => (
                            <li key={idx}>
                                {item.name} × {item.quantity} — ₹{item.subtotal}
                            </li>
                        ))}
                    </ul>

                    <p><b>Total:</b> ₹{selectedOrder.totalAmount}</p>

                    {selectedOrder.status === "CREATED" && (
                        <button
                            onClick={() => markCompleted(selectedOrder.orderId)}
                            style={{
                                backgroundColor: "#5cb85c",
                                color: "white",
                                border: "none",
                                padding: "8px 12px",
                                cursor: "pointer"
                            }}
                        >
                            Mark as Completed
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminOrderPage;

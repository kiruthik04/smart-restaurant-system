import "./AdminOrderPage.css";
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
        fetchOrders();
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
        <div className="admin-order-page">
            <h2>Admin – Order Management</h2>

            {message && <p className="admin-order-message">{message}</p>}
            {loading && <p>Loading orders...</p>}

            <div className="order-table-wrapper">
                <table className="admin-order-table">
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
                                    <span className={`status-${order.status.toLowerCase()}`}>
                                        {order.status === "CREATED" ? "Waiting for Kitchen" :
                                            order.status === "IN_PROGRESS" ? "Being Cooked" : "Done"}
                                    </span>
                                </td>
                                <td>
                                    <button className="view-btn" onClick={() => viewOrder(order.orderId)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL POPUP */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details #{selectedOrder.orderId}</h3>
                            <button className="close-modal" onClick={() => setSelectedOrder(null)}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-row">
                                <span><b>Table:</b> {selectedOrder.tableNumber}</span>
                                <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span>
                            </div>

                            <h4>Items Ordered</h4>
                            <ul className="modal-items-list">
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx}>
                                        <span className="item-info">{item.name} × {item.quantity}</span>
                                        <span className="item-price">₹{item.subtotal}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="modal-total">
                                <span>Total Amount</span>
                                <span>₹{selectedOrder.totalAmount}</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {selectedOrder.status === "CREATED" && (
                                <button className="complete-btn" onClick={() => markCompleted(selectedOrder.orderId)}>
                                    Mark as Completed
                                </button>
                            )}
                            <button className="secondary-btn" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrderPage;

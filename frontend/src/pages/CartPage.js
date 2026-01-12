import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orderApi";
import { getOrderSessionId } from "../utils/session";
import { getFoodImage } from "../utils/foodImageUtil";
import "./CartPage.css";

function CartPage() {
    const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // We can pull tableNumber from localStorage, similar to OrderPage
    const [tableNumber, setTableNumber] = useState(localStorage.getItem("tableNumber") || "");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = () => {
        if (!tableNumber) {
            setMessage("Please enter a table number.");
            return;
        }

        // Redirect to Login if user is not authenticated
        if (!user) {
            // Optional: You could pass state logic here to redirect back after login
            navigate("/login", { state: { from: "/cart" } });
            return;
        }

        if (cart.length === 0) return;

        setLoading(true);
        const orderSessionId = getOrderSessionId();

        const payload = {
            tableNumber: Number(tableNumber),
            orderSessionId: orderSessionId,
            userId: user ? user.id : null,
            items: cart.map(i => ({
                menuId: i.id,
                quantity: i.quantity
            }))
        };

        createOrder(payload)
            .then(() => {
                setMessage("Order placed successfully! Redirecting...");
                clearCart();
                // Save tableNumber preference just in case
                localStorage.setItem("tableNumber", tableNumber);

                // Redirect to Order Page (or status page) after short delay
                setTimeout(() => {
                    navigate("/order");
                }, 1500);
            })
            .catch(err => {
                console.error(err);
                setMessage(err.response?.data?.message || "Failed to place order. Please try again.");
                setLoading(false);
            });
    };

    if (cart.length === 0 && !message.includes("success")) {
        return (
            <div className="cart-page">
                <h2>Your Cart</h2>
                <div className="cart-empty-state">
                    <p>Your cart is empty. Hungry?</p>
                    <Link to="/order" className="continue-shopping-btn">Browse Menu</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            <p className="cart-subtitle">Review your selected items</p>

            {message && <div className={`toast-message ${message.includes("success") ? "success" : "error"}`} style={{ position: 'static', marginBottom: '1rem' }}>{message}</div>}

            <div className="cart-items-container">
                {cart.map(item => (
                    <div key={item.id} className="cart-item-row">
                        <div className="cart-item-image">
                            <img
                                src={item.imageUrl || getFoodImage(item.name, item.category)}
                                alt={item.name}
                            />
                        </div>
                        <div className="cart-item-details">
                            <span className="cart-item-name">{item.name}</span>
                            <span className="cart-item-price">₹{item.price} each</span>
                        </div>
                        <div className="cart-item-actions">
                            <div className="cart-qty-controls">
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span className="cart-qty-value">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <span className="cart-item-total">₹{item.price * item.quantity}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                </div>
                {/* Tax or other fees could go here */}
                <div className="summary-row total">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                </div>

                <div className="table-input-section">
                    <label>Table Number</label>
                    <input
                        type="number"
                        className="table-input"
                        placeholder="Enter your table number (e.g. 5)"
                        value={tableNumber}
                        onChange={(e) => {
                            setTableNumber(e.target.value);
                            localStorage.setItem("tableNumber", e.target.value);
                        }}
                    />
                </div>

                <div className="checkout-actions">
                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={loading || cart.length === 0 || !tableNumber}
                    >
                        {loading ? "Placing Order..." : "Confirm & Place Order"}
                    </button>
                    <Link to="/order" className="back-link">Add more items</Link>
                </div>
            </div>
        </div>
    );
}

export default CartPage;

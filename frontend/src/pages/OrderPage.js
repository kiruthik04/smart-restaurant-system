import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CategorySection from "../components/CategorySection";
import DealsSection from "../components/DealsSection";
import LoadingSpinner from "../components/LoadingSpinner";
// import Cart from "../components/Cart"; // Keeping Cart import commented out if needed later
// User said "remove the components", but removing Cart completely breaks the app functionality usually.
// I will keep Cart state but maybe hide the visual component or make it a floating/bottom sheet.
// Actually, for a "redesign", usually you want a floating cart button. 
// Let's implement a simple floating cart button that opens a modal or stays fixed at bottom.
// For now, I will stick to what I built: CategorySection passes `addToCart`.
// I will add a floating "View Cart" button if items > 0.
import { getAvailableMenuItems } from "../api/menuApi";
import { createOrder } from "../api/orderApi";
import { getOrderSessionId } from "../utils/session";
import { releaseTable } from "../api/tableApi";
import { clearOrderSession } from "../utils/session";
import api from "../api/axios";
import BillModal from "../components/BillModal";
import "./OrderPage.css";


function OrderPage() {
    const { user } = useAuth();
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState(localStorage.getItem("tableNumber") || "");
    const [message, setMessage] = useState("");
    const orderSessionId = getOrderSessionId();
    const [tableActive, setTableActive] = useState(false);
    const [releasing, setReleasing] = useState(false);
    const [billData, setBillData] = useState(null);
    const [showBill, setShowBill] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        setLoading(true);
        getAvailableMenuItems()
            .then((res) => {
                setMenu(res.data.filter(item => item.available));
            })
            .catch((err) => {
                console.error("MENU FETCH ERROR:", err);
                setMessage("Failed to load menu");
            })
            .finally(() => {
                // Simulate a slight delay for smooth animation if fetch is too fast
                setTimeout(() => setLoading(false), 800);
            });
    }, []);

    useEffect(() => {
        if (tableNumber) {
            localStorage.setItem("tableNumber", tableNumber);
        } else {
            localStorage.removeItem("tableNumber");
        }
    }, [tableNumber]);

    useEffect(() => {
        const fetchActiveOrder = async () => {
            let url = null;
            if (user && user.id) {
                url = `/api/orders/user/active/${user.id}`;
            } else if (orderSessionId) {
                url = `/api/orders/session/${orderSessionId}`;
            }

            if (url) {
                try {
                    const res = await api.get(url);
                    if (res.data) {
                        setTableActive(true);
                        if (res.data.tableNumber) {
                            setTableNumber(res.data.tableNumber);
                        }
                    }
                } catch (err) {
                    // Ignore
                }
            }
        };

        fetchActiveOrder();
    }, [user, orderSessionId]);

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setMessage(`${item.name} added to cart!`);
        setTimeout(() => setMessage(""), 2000);
    };

    const updateQuantity = (id, qty) => {
        setCart(prev =>
            prev.map(i =>
                i.id === id ? { ...i, quantity: qty } : i
            ).filter(i => i.quantity > 0)
        );
    };

    const navigate = useNavigate();
    const location = useLocation();

    const placeOrder = () => {
        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }

        if (!tableNumber || cart.length === 0) {
            setMessage("Table number and items are required");
            return;
        }

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
                setMessage("Order placed successfully");
                setCart([]);
                setTableActive(true);
                setShowCartModal(false);
            })
            .catch(err => {
                setMessage(err.response?.data?.message || "Order failed");
            });
    };

    const handleFinishClick = async () => {
        if (!tableNumber) {
            setMessage("Table number is required");
            return;
        }

        try {
            const res = await api.get(`/api/billing/by-number/${tableNumber}`);
            setBillData(res.data);
            setShowBill(true);
        } catch (err) {
            console.error("Billing fetch error", err);
            const errorMsg = typeof err.response?.data === 'string' ? err.response.data : "Unknown error";
            if (window.confirm(`Could not load bill summary (Server said: ${errorMsg}). Release table anyway?`)) {
                finishOrder();
            }
        }
    };

    const finishOrder = async () => {
        try {
            setReleasing(true);
            setShowBill(false);

            await releaseTable(Number(tableNumber));
            clearOrderSession();
            localStorage.removeItem("tableNumber");

            setCart([]);
            setTableNumber("");
            setTableActive(false);
            setBillData(null);
            setMessage("Table released successfully. Bill Paid.");

        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to release table");
        } finally {
            setReleasing(false);
        }
    };

    // Filter deals - assuming 'isDeal' or specific category exists, or just taking random 5 for demo if not present
    const deals = menu.filter(item => item.isDeal || item.category === 'Deals').slice(0, 5);
    // If no deals found, maybe take 3 specials
    const finalDeals = deals.length > 0 ? deals : menu.slice(0, 3);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="order-page-redesign">
            <header className="order-header">
                <div>
                    <h2>Welcome Foodie! 😋</h2>
                    <p className="subtitle">What are you craving today?</p>
                </div>
                <div className="table-info">
                    <label>Table #</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        className="table-input-minimal"
                    />
                </div>
            </header>

            {finalDeals.length > 0 && <DealsSection deals={finalDeals} addToCart={addToCart} />}

            <CategorySection menu={menu} addToCart={addToCart} />

            {/* Floating Cart Bar */}
            {cart.length > 0 && (
                <div className="floating-cart-bar" onClick={() => setShowCartModal(true)}>
                    <div className="cart-info">
                        <span className="cart-count">{cart.reduce((acc, item) => acc + item.quantity, 0)} Items</span>
                        <span className="cart-total">₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                    </div>
                    <button className="view-cart-btn">View Cart &gt;</button>
                </div>
            )}

            {/* Reuse Cart Component as Modal or Bottom Sheet could be better, but for now specific modal code */}
            {showCartModal && (
                <div className="cart-modal-overlay">
                    <div className="cart-modal-content">
                        <div className="cart-modal-header">
                            <h3>Your Cart</h3>
                            <button className="close-btn" onClick={() => setShowCartModal(false)}>×</button>
                        </div>
                        {cart.length === 0 ? <p>Cart is empty</p> : (
                            <div className="cart-items-list">
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item-row">
                                        <span>{item.name}</span>
                                        <div className="qty-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="cart-modal-footer">
                            <div className="total-row">
                                <span>Total</span>
                                <span>₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                            </div>
                            <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
                        </div>
                    </div>
                </div>
            )}


            {message && (
                <div className={`toast-message ${message.toLowerCase().includes("success") || message.includes("cart") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            {tableActive && !showCartModal && (
                <div className="active-table-status">
                    <span>Table {tableNumber} is Active</span>
                    <button onClick={handleFinishClick} disabled={releasing} className="finish-btn-small">
                        {releasing ? "..." : "Pay Bill"}
                    </button>
                </div>
            )}

            {showBill && (
                <BillModal
                    bill={billData}
                    onClose={() => setShowBill(false)}
                    onConvert={finishOrder}
                />
            )}
        </div>
    );
}

export default OrderPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CategorySection from "../components/CategorySection";
import LoadingSpinner from "../components/LoadingSpinner";
// import Cart from "../components/Cart"; // Keeping Cart import commented out if needed later
// User said "remove the components", but removing Cart completely breaks the app functionality usually.
// I will keep Cart state but maybe hide the visual component or make it a floating/bottom sheet.
// Actually, for a "redesign", usually you want a floating cart button. 
// Let's implement a simple floating cart button that opens a modal or stays fixed at bottom.
// For now, I will stick to what I built: CategorySection passes `addToCart`.
// I will add a floating "View Cart" button if items > 0.
import { getAvailableMenuItems } from "../api/menuApi";

import { getOrderSessionId } from "../utils/session";
import { releaseTable } from "../api/tableApi";
import { clearOrderSession } from "../utils/session";
import api from "../api/axios";
import BillModal from "../components/BillModal";
import "./OrderPage.css";


function OrderPage() {
    const { user } = useAuth();
    const { addToCart, totalItems, totalPrice } = useCart();
    const [menu, setMenu] = useState([]);
    // Local cart state removed
    const [tableNumber, setTableNumber] = useState(localStorage.getItem("tableNumber") || "");
    const [message, setMessage] = useState("");
    const orderSessionId = getOrderSessionId();
    const [tableActive, setTableActive] = useState(false);
    const [releasing, setReleasing] = useState(false);
    const [billData, setBillData] = useState(null);
    const [showBill, setShowBill] = useState(false);
    // showCartModal state removed
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

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 150) { // Threshold to trigger sticky behavior
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleAddToCart = (item) => {
        addToCart(item);
        setMessage(`${item.name} added to cart!`);
        setTimeout(() => setMessage(""), 2000);
    };

    // updateQuantity removed (handled in CartPage)

    const navigate = useNavigate();


    // placeOrder removed (moved to CartPage)

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

            // setCart([]); // Global cart is separate now, handled by user
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





    return (
        <div className="order-page-redesign">
            <header className="order-header">
                <div>
                    <h2><span className="gradient-text">Welcome Foodie!</span> 😋</h2>
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

            {loading ? (
                <div className="section-loading" style={{ minHeight: '300px', display: 'flex', alignItems: 'center' }}>
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <CategorySection menu={menu} addToCart={handleAddToCart} />
                </>
            )}

            {/* Floating Cart Bar - Redirects to Cart Page */}
            {totalItems > 0 && (
                <div className="floating-cart-bar" onClick={() => navigate("/cart")}>
                    <div className="cart-info">
                        <span className="cart-count">{totalItems} Items</span>
                        <span className="cart-total">₹{totalPrice}</span>
                    </div>
                    <button className="view-cart-btn">View Cart &gt;</button>
                </div>
            )}

            {/* Cart Modal removed */}


            {message && (
                <div className={`toast-message ${message.toLowerCase().includes("success") || message.includes("cart") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            {tableActive && (
                <div className={`active-table-status ${scrolled ? 'scrolled' : ''}`}>
                    <span>Table {tableNumber} Active</span>
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

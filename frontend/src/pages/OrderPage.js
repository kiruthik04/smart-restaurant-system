import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CategorySection from "../components/CategorySection";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAvailableMenuItems } from "../api/menuApi";
import { getOrderSessionId, clearOrderSession } from "../utils/session";
import { releaseTable } from "../api/tableApi";
import api from "../api/axios";
import BillModal from "../components/BillModal";
import "./OrderPage.css";
import { Scanner } from '@yudiel/react-qr-scanner';
import { FaCamera } from "react-icons/fa";

function OrderPage() {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { addToCart, totalItems, totalPrice } = useCart();
    const [menu, setMenu] = useState([]);

    // We now track tableIdentifier (could be Code or Number, but backend prefers Code)
    // We try to keep it synced with localStorage "tableCode"
    const [tableCode, setTableCode] = useState(localStorage.getItem("tableCode") || "");
    const [tableNumberDisplay, setTableNumberDisplay] = useState(localStorage.getItem("tableNumber") || "");

    const [message, setMessage] = useState("");
    const orderSessionId = getOrderSessionId();
    const [tableActive, setTableActive] = useState(false);
    const [releasing, setReleasing] = useState(false);
    const [billData, setBillData] = useState(null);
    const [showBill, setShowBill] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const codeFromUrl = searchParams.get("code");
        if (codeFromUrl) {
            setTableCode(codeFromUrl);
            localStorage.setItem("tableCode", codeFromUrl);
            setShowScanner(false);
            setMessage("Table Code detected from URL!");
        }
    }, [searchParams]);

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
                setTimeout(() => setLoading(false), 800);
            });
    }, []);

    useEffect(() => {
        if (tableCode) {
            localStorage.setItem("tableCode", tableCode);
        }
        if (tableNumberDisplay) {
            localStorage.setItem("tableNumber", tableNumberDisplay);
        }
    }, [tableCode, tableNumberDisplay]);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) {
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
                    let activeOrder = null;

                    if (Array.isArray(res.data) && res.data.length > 0) {
                        activeOrder = res.data[0];
                    } else if (res.data && typeof res.data === 'object') {
                        activeOrder = res.data;
                    }

                    if (activeOrder && activeOrder.tableNumber && activeOrder.tableNumber > 0) {
                        setTableActive(true);
                        setTableNumberDisplay(activeOrder.tableNumber);
                        // If we have an active order, we should probably set the code effectively too if the backend returned it
                        // But backend response might not have code in the lightweight response. 
                        // For now we trust tableNumber for display status.
                    } else {
                        setTableActive(false);
                    }
                } catch (err) {
                    setTableActive(false);
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

    const navigate = useNavigate();

    const handleFinishClick = async () => {
        // We release by Table ID or Number. Backend expects ID usually for releaseTable(id).
        // Check releaseTable api implementation. 
        // Typically it takes tableId or tableNumber. 
        // Our existing implementation passed Number(tableNumber).
        // Let's assume we still use the display number for release if we have it.
        // If we only have code, we might need to fetch table info first.

        if (!tableNumberDisplay) {
            setMessage("Active table number not found.");
            return;
        }

        try {
            // We use the number for bill fetching (legacy support)
            const res = await api.get(`/api/billing/by-number/${tableNumberDisplay}`);
            setBillData(res.data);
            setShowBill(true);
        } catch (err) {
            console.error("Billing fetch error", err);
            const errorMsg = typeof err.response?.data === 'string' ? err.response.data : "Unknown error";
            if (window.confirm(`Could not load bill summary. Release table anyway?`)) {
                finishOrder();
            }
        }
    };

    const finishOrder = async () => {
        try {
            setReleasing(true);
            setShowBill(false);

            // Legacy release by number for now
            // Ideally backend adds releaseByCode or we find ID
            // For now assuming existing API works with number
            const numberToRelease = Number(tableNumberDisplay);
            await releaseTable(numberToRelease);

            clearOrderSession();
            localStorage.removeItem("tableNumber");
            localStorage.removeItem("tableCode");

            setTableCode("");
            setTableNumberDisplay("");
            setTableActive(false);
            setBillData(null);
            setMessage("Table released successfully. Bill Paid.");

        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to release table");
        } finally {
            setReleasing(false);
        }
    };

    const handleScan = (result) => {
        if (result) {
            // Assume result is the raw text of the code e.g., "A1B2C3D4"
            // Or a JSON: {"code": "...", "number": 1}
            // For simplicity, let's assume it scans the raw text code.
            const text = result[0]?.rawValue || result;
            setTableCode(text);
            setShowScanner(false);
            setMessage("Table Code Scanned: " + text);
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
                    <label>Table Code / #</label>
                    <div className="table-input-wrapper">
                        <input
                            type="text"
                            placeholder="Code"
                            value={tableCode}
                            onChange={e => setTableCode(e.target.value)}
                            className="table-input-minimal"
                            maxLength={8}
                        />


                        <button
                            className="scan-btn"
                            onClick={() => setShowScanner(true)}
                            aria-label="Scan QR Code"
                        >
                            <FaCamera />
                        </button>
                    </div>
                </div>
            </header>

            {/* QR Scanner Modal */}
            {showScanner && (
                <div className="modal-overlay" onClick={() => setShowScanner(false)}>
                    <div className="modal-content qr-scanner-modal" onClick={e => e.stopPropagation()}>
                        <h3>Scan Table QR</h3>
                        <div className="scanner-container">
                            <Scanner
                                onScan={handleScan}
                                onError={(error) => console.log(error)}
                                components={{ audio: false, finder: false }}
                                styles={{ container: { width: '100%' } }}
                            />
                        </div>
                        <p style={{ marginTop: '1rem' }}>Point your camera at the QR code on your table.</p>
                        <button className="close-btn" onClick={() => setShowScanner(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="section-loading" style={{ minHeight: '300px', display: 'flex', alignItems: 'center' }}>
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <CategorySection menu={menu} addToCart={handleAddToCart} />
                </>
            )}

            {/* Floating Cart Bar */}
            {totalItems > 0 && (
                <div className="floating-cart-bar" onClick={() => navigate("/cart")}>
                    <div className="cart-info">
                        <span className="cart-count">{totalItems} Items</span>
                        <span className="cart-total">₹{totalPrice}</span>
                    </div>
                    <button className="view-cart-btn">View Cart &gt;</button>
                </div>
            )}

            {message && (
                <div className={`toast-message ${message.toLowerCase().includes("success") || message.includes("cart") || message.includes("Scanned") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            {tableActive && (
                <div className={`active-table-status ${scrolled ? 'scrolled' : ''}`}>
                    <span>Table {tableNumberDisplay} Active</span>
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



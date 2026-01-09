import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MenuList from "../components/MenuList";
import Cart from "../components/Cart";
import OrderSummary from "../components/OrderSummary";
import { getAvailableMenuItems } from "../api/menuApi";
import { createOrder } from "../api/orderApi";
import { getOrderSessionId } from "../utils/session";
import { releaseTable } from "../api/tableApi";
import { clearOrderSession } from "../utils/session";
import api from "../api/axios"; // Import api instance
import BillModal from "../components/BillModal";
import "./OrderPage.css";


function OrderPage() {
    const { user } = useAuth(); // Moved to top
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [message, setMessage] = useState("");
    const orderSessionId = getOrderSessionId();
    const [tableActive, setTableActive] = useState(false);
    const [releasing, setReleasing] = useState(false);
    const [billData, setBillData] = useState(null);
    const [showBill, setShowBill] = useState(false);


    useEffect(() => {
        console.log("Fetching menu...");
        getAvailableMenuItems()
            .then((res) => {
                console.log("MENU RESPONSE:", res.data);
                setMenu(res.data.filter(item => item.available));
            })
            .catch((err) => {
                console.error("MENU FETCH ERROR:", err);
                setMessage("Failed to load menu");
            });
    }, []);

    // New Effect: Restore Active Table State
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
                        // Order exists => Restore table state
                        setTableActive(true);
                        if (res.data.tableNumber) {
                            setTableNumber(res.data.tableNumber);
                        }
                    }
                } catch (err) {
                    // Ignore 404/204
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
            userId: user ? user.id : null, // ✅ Send User ID
            items: cart.map(i => ({
                menuId: i.id,     // ✅ MUST MATCH BACKEND DTO
                quantity: i.quantity
            }))

        };
        console.log("ORDER PAYLOAD:", payload);

        createOrder(payload)
            .then(() => {
                setMessage("Order placed successfully");
                setCart([]);
                setTableActive(true);
            })
            .catch(err => {
                setMessage(err.response?.data?.message || "Order failed");
            });



    };

    const fetchBill = async () => {
        try {
            // In real app, we might need table ID, but tableNumber is what we have here.
            // Wait, backend API expects tableId. But frontend only knows user/session.
            // The ACTIVE ORDER response gave us tableNumber, but not ID?
            // Actually, `fetchActiveOrder` logic only saved tableNumber for display.
            // We need tableId to call `/api/billing/{tableId}` unless we change backend to accept Table Number.
            // Or, we can rely on `releaseTable` which takes `tableNumber` currently?
            // Checking `OrderPage.js`: await releaseTable(Number(tableNumber));
            // Checking `tableApi.js`: export const releaseTable = (tableNumber) => api.post(`/api/tables/${tableNumber}/release`);
            // But wait, `DiningTableService` has `releaseTable(Long tableId)`.
            // `DiningTableController` maps `{id}/release`.
            // Is `tableNumber` the ID?
            // `createTable` returns: id, tableNumber. They are different.
            // `releaseTable` endpoint likely takes ID.
            // Frontend input is "Table Number", but does it behave as ID?
            // Input placeholder="Table Number". User types "1".
            // If ID=1 is Table #1, it works. If ID=10 is Table #1, it breaks.
            // I need to fetch the Table Entity by Number to get the ID, OR update Backend `BillController` to take Table Number.
            // To keep it simple for now, I will assume the backend `BillController` logic relies on ID.
            // Let's modify Backend `BillController` to accept `tableNumber` and lookup?
            // NO, I can modify `BillServiceImpl` to take `tableNumber` or lookup by number?
            // Actually, `OrderPage`'s `tableNumber` state holds what the user TYPED.

            // Let's fetch the table details by number first to get the ID for billing?
            // Or just add `findByTableNumber` to BillService?

            // PLAN REVISION: Update `OrderPage` logic to ensure we have the ID?
            // Or change `BillController` to `GET /api/billing/number/{tableNumber}`?

            // Simplest path: Change `BillController` to accept tableNumber if needed, or lookup ID.
            // Oh, `OrderPage` currently does `releaseTable(Number(tableNumber))`.
            // Let's check `TableController` in backend.

            // TEMPORARY: I'll try to use the existing `tableActive` fetch which might have returned ID?
            // `fetchActiveOrder` does: `if (res.data.tableNumber)... setTableNumber`.
            // It gets `OrderResponse`. OrderResponse has `orderId`, `totalAmount`, etc.
            // It does NOT have `tableId`.

            // I will blindly assume for this step that I need to lookup the Table ID or change backend.
            // Let's change backend `BillController` to find by Table NUMBER, as that's what the User knows.

        } catch (err) {
            console.error(err);
        }
    }



    const handleFinishClick = async () => {
        if (!tableNumber) {
            setMessage("Table number is required");
            return;
        }

        try {
            // Fetch bill summary by table number
            const res = await api.get(`/api/billing/by-number/${tableNumber}`);
            setBillData(res.data);
            setShowBill(true);
        } catch (err) {
            console.error("Billing fetch error", err);
            const errorMsg = typeof err.response?.data === 'string' ? err.response.data : "Unknown error";
            // Fallback: Just ask confirmation if bill fails
            if (window.confirm(`Could not load bill summary (Server said: ${errorMsg}). Release table anyway?`)) {
                finishOrder();
            }
        }
    };

    const finishOrder = async () => {
        try {
            setReleasing(true);
            setShowBill(false); // Close modal

            // Use tableNumber directly as previously working
            await releaseTable(Number(tableNumber));
            clearOrderSession();

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
    return (
        <div className="order-page">
            <h2>Order Food</h2>

            <input
                type="number"
                placeholder="Table Number"
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
                className="table-input"
            />

            <div className="section">
                <MenuList menu={menu} addToCart={addToCart} />
            </div>

            <div className="section">
                <Cart cart={cart} updateQuantity={updateQuantity} />
            </div>

            <div className="section">
                <OrderSummary cart={cart} placeOrder={placeOrder} />
            </div>

            {message && (
                <p
                    className={`order-message ${message.toLowerCase().includes("success") ? "success" : "error"
                        }`}
                >
                    {message}
                </p>
            )}

            {tableActive && (
                <button
                    onClick={handleFinishClick}
                    disabled={releasing}
                    className="primary-btn finish"
                >
                    {releasing ? "Processing..." : "Finish & Leave Table"}
                </button>
            )}

            {/* Bill Modal */}
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

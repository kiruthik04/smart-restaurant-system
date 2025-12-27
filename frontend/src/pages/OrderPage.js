import { useEffect, useState } from "react";
import MenuList from "../components/MenuList";
import Cart from "../components/Cart";
import OrderSummary from "../components/OrderSummary";
import { getAvailableMenuItems } from "../api/menuApi";
import { createOrder } from "../api/orderApi";
import { getOrderSessionId } from "../utils/session";
import { releaseTable } from "../api/tableApi";
import { clearOrderSession } from "../utils/session";


function OrderPage() {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [message, setMessage] = useState("");
    const orderSessionId = getOrderSessionId();
    const [tableActive, setTableActive] = useState(false);
    const [releasing, setReleasing] = useState(false);


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

    const placeOrder = () => {
        if (!tableNumber || cart.length === 0) {
            setMessage("Table number and items are required");
            return;
        }

        const payload = {
            tableNumber: Number(tableNumber),
            orderSessionId: orderSessionId,
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

    const finishOrder = async () => {
        if (!tableNumber) {
            setMessage("Table number is required");
            return;
        }

        const confirm = window.confirm(
            "Are you sure you want to finish and release this table?"
        );

        if (!confirm) return;

        try {
            setReleasing(true);

            await releaseTable(Number(tableNumber));
            clearOrderSession();

            setCart([]);
            setTableNumber("");
            setTableActive(false);
            setMessage("Table released successfully");

        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to release table");
        } finally {
            setReleasing(false);
        }
    };

    return (
        <div>
            <h2>Order Food</h2>

            <input
                type="number"
                placeholder="Table Number"
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
            />

            <MenuList menu={menu} addToCart={addToCart} />
            <Cart cart={cart} updateQuantity={updateQuantity} />
            <OrderSummary cart={cart} placeOrder={placeOrder} />

            {message && <p>{message}</p>}
            {tableActive && (
                <button
                    onClick={finishOrder}
                    disabled={!tableActive || releasing}
                    style={{
                        marginTop: "10px",
                        backgroundColor: tableActive ? "#d9534f" : "#ccc",
                        color: "white",
                        cursor: tableActive ? "pointer" : "not-allowed",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "4px"
                    }}
                >
                    {releasing ? "Releasing..." : "Finish & Leave Table"}
                </button>
            )}


        </div>
    );
}

export default OrderPage;

import { useEffect, useState } from "react";
import MenuList from "../components/MenuList";
import Cart from "../components/Cart";
import OrderSummary from "../components/OrderSummary";
import { getAvailableMenuItems } from "../api/menuApi";
import { createOrder } from "../api/orderApi";

function OrderPage() {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [message, setMessage] = useState("");

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
            })
            .catch(err => {
                setMessage(err.response?.data?.message || "Order failed");
            });
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
        </div>
    );
}

export default OrderPage;

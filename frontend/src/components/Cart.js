import "./Cart.css";

function Cart({ cart, updateQuantity }) {
  return (
    <div className="cart-container">
      <h3>Cart</h3>

      {cart.length === 0 && (
        <p className="cart-empty">No items selected</p>
      )}

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>

          <input
            className="cart-qty"
            type="number"
            value={item.quantity}
            min="0"
            onChange={e =>
              updateQuantity(item.id, Number(e.target.value))
            }
          />
        </div>
      ))}
    </div>
  );
}

export default Cart;

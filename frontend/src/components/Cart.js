function Cart({ cart, updateQuantity }) {
  return (
    <div>
      <h3>Cart</h3>
      {cart.length === 0 && <p>No items selected</p>}

      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <input
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

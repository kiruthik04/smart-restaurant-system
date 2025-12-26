function OrderSummary({ cart, placeOrder }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h3>Summary</h3>
      <p>Total: ₹{total}</p>
      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default OrderSummary;

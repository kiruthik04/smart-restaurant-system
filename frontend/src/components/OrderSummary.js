function OrderSummary({ cart, placeOrder }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="summary-container">
      <h3>Summary</h3>

      <p className="summary-total">
        Total: ₹{total}
      </p>

      <button
        className="place-order-btn"
        onClick={placeOrder}
        disabled={total === 0}
      >
        Place Order
      </button>
    </div>
  );
}

export default OrderSummary;

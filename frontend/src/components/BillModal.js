import React from 'react';
import './BillModal.css';

function BillModal({ bill, onClose, onConvert }) {
    const [paymentMethod, setPaymentMethod] = React.useState('UPI');
    const [cardDetails, setCardDetails] = React.useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = React.useState(false);

    if (!bill) return null;

    // Merchant VPA - Replace with actual
    const merchantVPA = "merchant@upi";
    const merchantName = "Smart Restaurant";
    const amount = bill.grandTotal.toFixed(2);

    // Construct UPI String
    // Format: upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR
    const upiString = `upi://pay?pa=${merchantVPA}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;

    const handleCardInput = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const processCardPayment = () => {
        // Basic Validation
        if (cardDetails.number.length < 16 || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
            alert("Please enter valid card details.");
            return;
        }

        setIsProcessing(true);
        // Simulate Network Delay
        setTimeout(() => {
            setIsProcessing(false);
            onConvert(); // Trigger success parent flow
        }, 2500);
    };

    return (
        <div className="bill-modal-overlay">
            <div className="bill-modal">
                <button className="bill-modal-close" onClick={onClose}>
                    ×
                </button>
                <h2>Bill Summary - Table {bill.tableNumber}</h2>
                <div className="bill-content">
                    {bill.orders.map((order, index) => (
                        <div key={order.orderId} className="bill-order-section">
                            <h3>Order #{index + 1} (Ref: {order.orderId})</h3>
                            <ul>
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{item.subtotal.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="order-total">
                                <strong>Subtotal: ₹{order.totalAmount.toFixed(2)}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Section */}
                <div className="payment-section">
                    <h3>Select Payment Method</h3>
                    <div className="payment-tabs">
                        <button
                            className={`tab-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('UPI')}
                        >
                            UPI / QR
                        </button>
                        <button
                            className={`tab-btn ${paymentMethod === 'CARD' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('CARD')}
                        >
                            Credit/Debit Card
                        </button>
                        <button
                            className={`tab-btn ${paymentMethod === 'NETBANKING' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('NETBANKING')}
                        >
                            Net Banking
                        </button>
                        <button
                            className={`tab-btn ${paymentMethod === 'CASH' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('CASH')}
                        >
                            Cash
                        </button>
                    </div>

                    <div className="payment-display">
                        {paymentMethod === 'UPI' && (
                            <div className="upi-container">
                                <p>Scan to Pay with any UPI App</p>
                                <img src={qrCodeUrl} alt="UPI QR Code" className="qr-code-img" />
                                <small>VPA: {merchantVPA}</small>
                            </div>
                        )}
                        {paymentMethod === 'CARD' && (
                            <div className="card-simulator">
                                {isProcessing ? (
                                    <div className="processing-state">
                                        <div className="spinner"></div>
                                        <p>Processing Payment...</p>
                                        <small>Connecting to Secure Gateway</small>
                                    </div>
                                ) : (
                                    <div className="card-form">
                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input
                                                type="text"
                                                name="number"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength="19"
                                                value={cardDetails.number}
                                                onChange={handleCardInput}
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    value={cardDetails.expiry}
                                                    onChange={handleCardInput}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    placeholder="123"
                                                    maxLength="3"
                                                    value={cardDetails.cvv}
                                                    onChange={handleCardInput}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Card Holder Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="JOHN DOE"
                                                value={cardDetails.name}
                                                onChange={handleCardInput}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {paymentMethod === 'NETBANKING' && (
                            <div className="net-banking-container">
                                {isProcessing ? (
                                    <div className="processing-state">
                                        <div className="spinner"></div>
                                        <p>Redirecting to Bank...</p>
                                        <small>Please do not refresh</small>
                                    </div>
                                ) : (
                                    <div className="bank-selection">
                                        <p>Select your Bank</p>
                                        <select className="bank-dropdown" defaultValue="">
                                            <option value="" disabled>Choose a Bank</option>
                                            <option value="HDFC">HDFC Bank</option>
                                            <option value="ICICI">ICICI Bank</option>
                                            <option value="SBI">State Bank of India</option>
                                            <option value="AXIS">Axis Bank</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                        {paymentMethod === 'CASH' && (
                            <div className="instruction-box">
                                <span className="icon">💵</span>
                                <p>Please pay cash at the counter to the cashier.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bill-footer">
                    <div className="grand-total">
                        <strong>Grand Total: ₹{bill.grandTotal.toFixed(2)}</strong>
                    </div>
                    <div className="bill-actions">
                        {paymentMethod === 'CARD' || paymentMethod === 'NETBANKING' ? (
                            <button
                                onClick={processCardPayment} // Reuse logic for now or create separate handler
                                className="primary-btn pay-btn"
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : `Pay ₹${amount} Now`}
                            </button>
                        ) : (
                            <button onClick={onConvert} className="primary-btn pay-btn">
                                Confirm Payment & Release Table
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillModal;

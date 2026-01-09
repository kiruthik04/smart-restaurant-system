import React from 'react';
import './BillModal.css';

function BillModal({ bill, onClose, onConvert }) {
    if (!bill) return null;

    return (
        <div className="bill-modal-overlay">
            <div className="bill-modal">
                <h2>Bill Summary - Table {bill.tableNumber}</h2>
                <div className="bill-content">
                    {bill.orders.map((order, index) => (
                        <div key={order.orderId} className="bill-order-section">
                            <h3>Order #{index + 1} (Ref: {order.orderId})</h3>
                            <ul>
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${item.subtotal.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="order-total">
                                <strong>Subtotal: ${order.totalAmount.toFixed(2)}</strong>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bill-footer">
                    <div className="grand-total">
                        <strong>Grand Total: ${bill.grandTotal.toFixed(2)}</strong>
                    </div>
                    <div className="bill-actions">
                        <button onClick={onClose} className="secondary-btn">Cancel</button>
                        <button onClick={onConvert} className="primary-btn pay-btn">Pay & Release Table</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillModal;

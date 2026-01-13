import React from 'react';
import './DealsSection.css';
import './DealsSection.css';

const DealsSection = ({ deals, addToCart }) => {
    if (!deals || deals.length === 0) return null;

    return (
        <div className="deals-section">
            <h2 className="deals-header">
                🔥 Deals of the Day
            </h2>
            <div className="deals-scroll-container">
                {deals.map(deal => (
                    <div key={deal.id} className="deal-card">
                        <div className="deal-image-container">
                            <img
                                src={`/api/menu/${deal.id}/image`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/400x300?text=No+Image";
                                }}
                                alt={deal.name}
                                className="deal-image"
                            />
                            <span className="deal-badge">Special Offer</span>
                        </div>
                        <div className="deal-content">
                            <h3 className="deal-title">{deal.name}</h3>
                            <p className="deal-description">{deal.description || 'Delicious meal just for you today!'}</p>
                            <div className="deal-footer">
                                <div className="price-container">
                                    <span className="deal-price">₹{deal.price}</span>
                                    {deal.originalPrice && (
                                        <span className="deal-original-price">₹{deal.originalPrice}</span>
                                    )}
                                </div>
                                <button
                                    className="add-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(deal);
                                    }}
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsSection;

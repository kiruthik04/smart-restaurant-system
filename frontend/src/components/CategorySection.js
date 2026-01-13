import React, { useState } from 'react';
import './CategorySection.css';
import './CategorySection.css';

const CategorySection = ({ menu, addToCart }) => {

    const [searchQuery, setSearchQuery] = useState("");

    // Filtering logic: Search Only
    // If search is empty, show all items (previously activeCategory="All")
    const displayedItems = searchQuery.trim() !== ""
        ? menu.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : menu;

    return (
        <div className="category-section">

            {/* Search Bar */}
            <div className="search-wrapper">
                <input
                    type="text"
                    className="menu-search-input"
                    placeholder="Search for dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Menu Grid */}
            <div className="menu-list-container">
                {searchQuery && <h3 className="search-results-title">Found {displayedItems.length} results</h3>}

                <div className="items-grid">
                    {displayedItems.length > 0 ? (
                        displayedItems.map(item => (
                            <div key={item.id} className="menu-item-card">
                                <div className="item-image-box">
                                    <img
                                        src={`/api/menu/${item.id}/image`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/400x300?text=No+Image"; // Fallback
                                        }}
                                        alt={item.name}
                                        className="item-image"
                                    />
                                </div>
                                <div className="item-details">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-desc-short">{item.description || item.category}</div>
                                    <div className="item-bottom">
                                        <span className="item-price">₹{item.price}</span>
                                        <button
                                            className="item-add-btn"
                                            onClick={() => addToCart(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-items-message">
                            <p>No items found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategorySection;

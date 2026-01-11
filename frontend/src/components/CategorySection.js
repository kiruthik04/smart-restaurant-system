import React, { useState, useEffect } from 'react';
import './CategorySection.css';
import { getFoodImage } from '../utils/foodImageUtil';

const CategorySection = ({ menu, addToCart }) => {
    // Extract unique categories, ensuring 'All' is NOT the default first item for strict tabs
    const categories = [...new Set(menu.map(item => item.category || "Others"))];

    // Default to the first category if available
    const [activeCategory, setActiveCategory] = useState(categories[0] || "All");
    const [searchQuery, setSearchQuery] = useState("");

    // Effect to set initial category when menu loads
    useEffect(() => {
        if (categories.length > 0 && !categories.includes(activeCategory) && activeCategory !== "All") {
            setActiveCategory(categories[0]);
        }
    }, [menu]);

    // Filtering logic
    // 1. If Search is active -> Show ALL items matching search (ignore category tabs)
    // 2. If Search is empty -> Show items for ACTIVE category only
    const displayedItems = searchQuery.trim() !== ""
        ? menu.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : menu.filter(item => (item.category || "Others") === activeCategory);

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

            {/* Hide tabs if searching to reduce clutter, or keep them to switch back? 
                Keeping them is better context, but maybe disable them or visually dim them.
                Actually, standard pattern: tabs filter, search overrides.
            */}
            {!searchQuery && (
                <div className="category-nav">
                    {categories.map(cat => (
                        <div
                            key={cat}
                            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            )}

            <div className="menu-list-container">
                {searchQuery && <h3 className="search-results-title">Found {displayedItems.length} results</h3>}

                <div className="items-grid">
                    {displayedItems.length > 0 ? (
                        displayedItems.map(item => (
                            <div key={item.id} className="menu-item-card">
                                <div className="item-image-box">
                                    <img
                                        src={item.imageUrl || getFoodImage(item.name, item.category)}
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

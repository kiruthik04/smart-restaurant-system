import React, { useState, useEffect, useRef, useCallback } from 'react';
import { baseURL } from '../api/axios';
import './CategorySection.css';

const CategorySection = ({ menu, addToCart }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(12); // Initial load count
    const observerTarget = useRef(null);

    // Filtering logic: Search Only
    const filteredItems = searchQuery.trim() !== ""
        ? menu.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : menu;

    // Slice for display
    const displayedItems = filteredItems.slice(0, visibleCount);
    const hasMore = visibleCount < filteredItems.length;

    // Reset pagination when search changes
    useEffect(() => {
        setVisibleCount(12);
    }, [searchQuery]);

    // Infinite Scroll Observer
    const handleObserver = useCallback((entries) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore) {
            setVisibleCount(prev => prev + 12); // Load 12 more
        }
    }, [hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px", // Preload before reaching bottom
            threshold: 0.1
        });

        const currentTarget = observerTarget.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [handleObserver]);

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
                {searchQuery && <h3 className="search-results-title">Found {filteredItems.length} results</h3>}

                <div className="items-grid">
                    {displayedItems.length > 0 ? (
                        displayedItems.map(item => (
                            <div key={item.id} className="menu-item-card">
                                <div className="item-image-box">
                                    <img
                                        src={`${baseURL}/api/menu/${item.id}/image`}
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

                {/* Loading Sentinel */}
                {hasMore && (
                    <div ref={observerTarget} className="scroll-loader">
                        <div className="loader-dots">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySection;

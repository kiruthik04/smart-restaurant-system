import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { baseURL } from '../api/axios';
import './CategorySection.css';

const CategorySection = ({ menu, addToCart }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(12);
    const observerTarget = useRef(null);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = ["All", ...new Set(menu.map(item => item.category))];
        return cats.filter(c => c); // Remove null/undefined
    }, [menu]);

    // Filtering Logic
    const filteredItems = useMemo(() => {
        return menu.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [menu, searchQuery, selectedCategory]);

    // Slice for display
    const displayedItems = filteredItems.slice(0, visibleCount);
    const hasMore = visibleCount < filteredItems.length;

    // Reset pagination when filter changes
    useEffect(() => {
        setVisibleCount(12);
    }, [searchQuery, selectedCategory]);

    // Infinite Scroll Observer
    const handleObserver = useCallback((entries) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore) {
            setVisibleCount(prev => prev + 12);
        }
    }, [hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "100px",
            threshold: 0.1
        });

        const currentTarget = observerTarget.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [handleObserver]);

    return (
        <div className="category-section">

            {/* Category Filter Chips */}
            <div className="category-chips-container">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

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
                {(searchQuery || selectedCategory !== "All") &&
                    <h3 className="search-results-title">
                        {selectedCategory !== "All" ? `${selectedCategory} ` : ""}
                        {searchQuery ? `matches excluding "${searchQuery}"` : "Menu"}
                        ({filteredItems.length})
                    </h3>
                }

                <div className="items-grid">
                    {displayedItems.length > 0 ? (
                        displayedItems.map(item => (
                            <div key={item.id} className="menu-item-card">
                                <div className="item-image-box">
                                    <img
                                        src={`${baseURL}/api/menu/${item.id}/image`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/400x300?text=No+Image";
                                        }}
                                        alt={item.name}
                                        className="item-image"
                                    />
                                    {/* Category Tag on Image */}
                                    <span className="item-category-tag">{item.category}</span>
                                </div>
                                <div className="item-details">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-desc-short">{item.description}</div>
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
                            <p>No items found related to your search/filter.</p>
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

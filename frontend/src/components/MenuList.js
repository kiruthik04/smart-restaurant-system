import "./MenuList.css";

function MenuList({ menu, addToCart }) {
    return (
        <div className="menu-container">
            <h3>Menu</h3>
            <div className="menu-grid">
                {menu.map(item => (
                    <div key={item.id} className="menu-row">
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">₹{item.price}</span>
                        <div className="menu-action">
                            <button
                                className="menu-add-btn"
                                onClick={() => addToCart(item)}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuList;
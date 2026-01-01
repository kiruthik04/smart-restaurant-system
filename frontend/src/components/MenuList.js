import "./MenuList.css";

function MenuList({ menu, addToCart }) {
    return (
        <div className="menu-container">
            <h3>Menu</h3>

            {menu.map(item => (
                <div key={item.id} className="menu-item">
                    <span>
                        {item.name}
                        <span className="menu-price"> – ₹{item.price}</span>
                    </span>

                    <button
                        className="menu-add-btn"
                        onClick={() => addToCart(item)}
                    >
                        Add
                    </button>
                </div>
            ))}
        </div>
    );
}

export default MenuList;

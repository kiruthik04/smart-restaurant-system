function MenuList({ menu, addToCart }) {
    return (
        <div>
            <h3>Menu</h3>
            {menu.map(item => (
                <div key={item.id}>
                    <span>{item.name} – ₹{item.price}</span>
                    <button onClick={() => addToCart(item)}>
                        Add
                    </button>
                </div>
            ))}
        </div>
    );
}

export default MenuList;

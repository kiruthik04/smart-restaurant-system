import "./ChefSpecials.css";
const ChefSpecials = ({ specials }) => {
  return (
    <div className="chef-specials-section">
      <h3>Chef's Recommendations</h3>
      <div className="specials-grid">
        {specials.map(item => (
          <div key={item.id} className="special-card">
            <img src={item.imageUrl} alt={item.name} />
            <div className="special-info">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
              <button className="quick-add-btn">Quick Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
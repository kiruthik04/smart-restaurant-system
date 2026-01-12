import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Smart Restaurant
        </Link>

        <div className={`navbar-links ${open ? "open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/order" onClick={() => setOpen(false)}>
            Order Food
          </Link>
          <Link to="/tables" onClick={() => setOpen(false)}>
            Tables
          </Link>
          <Link to="/events" onClick={() => setOpen(false)}>
            Events
          </Link>

          {user && user.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
          )}
          {user && (user.role === 'KITCHEN' || user.role === 'ADMIN') && (
            <Link to="/kitchen" onClick={() => setOpen(false)}>Kitchen</Link>
          )}

          {/* Desktop Only Cart Icon */}
          <Link to="/cart" onClick={() => setOpen(false)} className="cart-link desktop-cart">
            <div className="cart-icon-container">
              <FaShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
          </Link>

          {user ? (
            <button onClick={handleLogout} className="nav-btn">
              Logout ({user.username})
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {/* Mobile Only Cart Icon */}
          <Link to="/cart" className="cart-link mobile-cart" onClick={() => setOpen(false)}>
            <div className="cart-icon-container">
              <FaShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

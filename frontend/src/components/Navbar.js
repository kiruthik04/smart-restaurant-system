import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Love, Rosie
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

          {!user && (
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>

        <div className="navbar-actions">
          {user && (
            <div className="profile-icon-container" style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setOpen(false);
                }}
                className="nav-btn icon-btn"
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
              >
                <FaUserCircle size={24} />
              </button>
              <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
            </div>
          )}

          {/* Cart Icon - Visible on both now if we want, or keep logic. 
              The user said "profile icon for it in both mobile and normal view".
              Existing code has separate mobile/desktop carts. 
              Refactoring to unified cart might be out of scope but cleaner. 
              For now, I will touch only Profile.
          */}

          {/* Mobile Only Cart Icon - existing logic implies desktop cart is in links. 
              Wait, checking lines 46-51 in original file, desktop cart is in links.
              If I move profile to actions, it will be to the RIGHT of links.
          */}
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

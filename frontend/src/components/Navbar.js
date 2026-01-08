import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
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

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

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
      </div>
    </nav>
  );
}

export default Navbar;

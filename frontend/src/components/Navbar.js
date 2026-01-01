import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

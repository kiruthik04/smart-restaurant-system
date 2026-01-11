import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineTable,
  HiOutlineClipboardList,
  HiOutlineMenu,
  HiOutlineFire,
  HiOutlineCalendar,
  HiOutlineMenuAlt2,
  HiOutlineUsers,
  HiOutlineLogout
} from "react-icons/hi";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminSidebar.css";

function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (setMobileOpen) setMobileOpen(false);
  }, [location, setMobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      {/* Updated Header Structure */}
      <div className="sidebar-header">
        {/* New flex/grid container to keep items side-by-side */}
        <div className="header-content">
          <button
            className="collapse-btn"
            onClick={() => {
              if (mobileOpen) setMobileOpen(false); // Close on mobile
              else setCollapsed(!collapsed); // Toggle on desktop
            }}
            aria-label="Toggle Sidebar"
          >
            <HiOutlineMenu />
          </button>

          {(!collapsed || mobileOpen) && (
            <h2 className="admin-logo">Smart Restro</h2>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <Link
          to="/admin"
          className={location.pathname === "/admin" ? "active" : ""}
          title="Dashboard"
        >
          <span className="nav-icon">
            <HiOutlineViewGrid />
          </span>
          {(!collapsed || mobileOpen) && <span>Dashboard</span>}
        </Link>

        <Link
          to="/admin/tables"
          className={location.pathname.includes("tables") ? "active" : ""}
          title="Tables"
        >
          <span className="nav-icon">
            <HiOutlineTable />
          </span>
          {(!collapsed || mobileOpen) && <span>Tables</span>}
        </Link>

        <Link
          to="/admin/orders"
          className={location.pathname.includes("orders") ? "active" : ""}
          title="Orders"
        >
          <span className="nav-icon">
            <HiOutlineClipboardList />
          </span>
          {(!collapsed || mobileOpen) && <span>Orders</span>}
        </Link>

        <Link
          to="/admin/kitchen"
          className={`nav-link ${location.pathname.includes("kitchen") ? "active" : ""}`}
          title="Kitchen"
        >
          <span className="nav-icon">
            <HiOutlineFire />
          </span>
          {(!collapsed || mobileOpen) && <span>Kitchen</span>}
        </Link>

        <Link
          to="/admin/events"
          className={`nav-link ${location.pathname.includes("events") ? "active" : ""}`}
          title="Events"
        >
          <span className="nav-icon">
            <HiOutlineCalendar />
          </span>
          {(!collapsed || mobileOpen) && <span>Events</span>}
        </Link>

        <Link
          to="/admin/menu"
          className={`nav-link ${location.pathname.includes("menu") ? "active" : ""}`}
          title="Menu"
        >
          <span className="nav-icon">
            <HiOutlineMenuAlt2 />
          </span>
          {(!collapsed || mobileOpen) && <span>Menu</span>}
        </Link>

        <Link
          to="/admin/staff"
          className={`nav-link ${location.pathname.includes("staff") ? "active" : ""}`}
          title="Staff"
        >
          <span className="nav-icon">
            <HiOutlineUsers />
          </span>
          {(!collapsed || mobileOpen) && <span>Staff</span>}
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn" title="Logout">
          <span className="nav-icon"><HiOutlineLogout /></span>
          {(!collapsed || mobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

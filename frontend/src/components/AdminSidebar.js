import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineTable,
  HiOutlineClipboardList,
  HiOutlineMenu,
  HiOutlineFire,
  HiOutlineCalendar,
  HiOutlineMenuAlt2
} from "react-icons/hi";
import { useEffect, useState } from "react";
import "./AdminSidebar.css";

function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Auto collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Updated Header Structure */}
      <div className="sidebar-header">
        {/* New flex/grid container to keep items side-by-side */}
        <div className="header-content">
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          >
            <HiOutlineMenu />
          </button>

          {!collapsed && (
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
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <Link
          to="/admin/tables"
          className={location.pathname.includes("tables") ? "active" : ""}
          title="Tables"
        >
          <span className="nav-icon">
            <HiOutlineTable />
          </span>
          {!collapsed && <span>Tables</span>}
        </Link>

        <Link
          to="/admin/orders"
          className={location.pathname.includes("orders") ? "active" : ""}
          title="Orders"
        >
          <span className="nav-icon">
            <HiOutlineClipboardList />
          </span>
          {!collapsed && <span>Orders</span>}
        </Link>

        <Link
          to="/admin/kitchen"
          className={`nav-link ${location.pathname.includes("kitchen") ? "active" : ""}`}
          title="Kitchen"
        >
          <span className="nav-icon">
            <HiOutlineFire />
          </span>
          {!collapsed && <span>Kitchen</span>}
        </Link>

        <Link
          to="/admin/events"
          className={`nav-link ${location.pathname.includes("events") ? "active" : ""}`}
          title="Events"
        >
          <span className="nav-icon">
            <HiOutlineCalendar />
          </span>
          {!collapsed && <span>Events</span>}
        </Link>

        <Link
          to="/admin/menu"
          className={`nav-link ${location.pathname.includes("menu") ? "active" : ""}`}
          title="Menu"
        >
          <span className="nav-icon">
            <HiOutlineMenuAlt2 />
          </span>
          {!collapsed && <span>Menu</span>}
        </Link>
      </nav>
    </aside>
  );
}

export default AdminSidebar;

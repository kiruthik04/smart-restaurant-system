import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false); // Reset mobile state on desktop
        setCollapsed(false);
      } else {
        setCollapsed(true); // Default to collapsed on mobile (though we'll hide it)
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
        <span className="mobile-brand">Smart Restro</span>
      </div>

      {/* Sidebar - Passed mobileOpen state */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Overlay for mobile when sidebar is open */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className={`admin-content ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
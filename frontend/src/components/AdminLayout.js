import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  // Synchronize state with Sidebar logic
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      {/* Pass state and setter to Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`admin-content ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
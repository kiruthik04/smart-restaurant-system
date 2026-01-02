import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTables } from "../api/adminTableApi";
import { getAllOrders } from "../api/adminOrderApi";
import "./AdminDashboardPage.css";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalTables: 0,
    tablesInUse: 0,
    activeOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    Promise.all([getAllTables(), getAllOrders()])
      .then(([tableRes, orderRes]) => {
        const tables = tableRes.data;
        const orders = orderRes.data;

        setStats({
          totalTables: tables.length,
          tablesInUse: tables.filter(t => t.inUse).length,
          activeOrders: orders.filter(o => o.status !== "COMPLETED").length,
          completedOrders: orders.filter(o => o.status === "COMPLETED").length,
        });
      })
      .catch(() => {
        // silent fail for dashboard
      });
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalTables}</h3>
          <p>Total Tables</p>
        </div>

        <div className="stat-card warning">
          <h3>{stats.tablesInUse}</h3>
          <p>Tables In Use</p>
        </div>

        <div className="stat-card info">
          <h3>{stats.activeOrders}</h3>
          <p>Active Orders</p>
        </div>

        <div className="stat-card success">
          <h3>{stats.completedOrders}</h3>
          <p>Completed Orders</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <Link to="/admin/tables" className="action-card">
          Manage Tables
        </Link>

        <Link to="/admin/orders" className="action-card">
          Manage Orders
        </Link>

        <Link to="/kitchen" className="action-card">
          Kitchen View
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboardPage;

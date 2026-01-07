import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTables } from "../api/adminTableApi";
import { getAllOrders } from "../api/adminOrderApi";
import { getAnalytics } from "../api/adminAnalyticsApi";
import "./AdminDashboardPage.css";
import AdminDashboardCharts from "../components/AdminDashboardCharts";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalTables: 0,
    tablesInUse: 0,
    activeOrders: 0,
    completedOrders: 0,
  });

  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState("TODAY");

  const [analytics, setAnalytics] = useState({
    mostOrderedItems: [],
    peakHours: [],
    totalOrders: 0,
    totalRevenue: 0
  });

  // Tables + Orders (static dashboard data)
  useEffect(() => {
    Promise.all([getAllTables(), getAllOrders()])
      .then(([tableRes, orderRes]) => {
        const tables = tableRes.data;
        const orders = orderRes.data;

        setTables(tables);
        setOrders(orders);

        setStats({
          totalTables: tables.length,
          tablesInUse: tables.filter(t => t.inUse).length,
          activeOrders: orders.filter(o => o.status !== "COMPLETED").length,
          completedOrders: orders.filter(o => o.status === "COMPLETED").length,
        });
      })
      .catch(() => { });
  }, []);

  // 🔥 Analytics (depends on range)
  useEffect(() => {
    getAnalytics(range)
      .then(res => setAnalytics(res.data))
      .catch(() => { });
  }, [range]);

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

      {/* Filters */}
      <div className="dashboard-filters">
        <label htmlFor="range-select">
          Time Range
        </label>

        <select
          id="range-select"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="TODAY">Today</option>
          <option value="LAST_7_DAYS">Last 7 Days</option>
          <option value="LAST_30_DAYS">Last 30 Days</option>
        </select>
      </div>

      {/* Charts */}
      <AdminDashboardCharts
        tables={tables}
        orders={orders}
        analytics={analytics}
      />


    </div>
  );
}

export default AdminDashboardPage;

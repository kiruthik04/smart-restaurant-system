import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  Legend
} from "chart.js";

import { Pie, Bar, Line } from "react-chartjs-2";
import "./AdminDashboardCharts.css";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  Legend
);

function AdminDashboardCharts({ tables, orders, analytics }) {
  console.log("📊 DASHBOARD DATA");
  console.log("Tables:", tables);
  console.log("Orders:", orders);
  console.log("Analytics:", analytics);
  console.log("Most Ordered Items:", analytics?.mostOrderedItems);
  console.log("Peak Hours:", analytics?.peakHours);
  console.log("Revenue Timeline:", analytics?.revenueTimeline);
  const orderStatusCount = {
    CREATED: orders.filter(o => o.status === "CREATED").length,
    IN_PROGRESS: orders.filter(o => o.status === "IN_PROGRESS").length,
    COMPLETED: orders.filter(o => o.status === "COMPLETED").length
  };

  const ordersPieData = {
    labels: ["Created", "In Progress", "Completed"],
    datasets: [{
      data: [
        orderStatusCount.CREATED,
        orderStatusCount.IN_PROGRESS,
        orderStatusCount.COMPLETED
      ],
      backgroundColor: ["#f59e0b", "#2563eb", "#16a34a"]
    }]
  };

  const tableBarData = {
    labels: ["Free", "In Use", "Disabled"],
    datasets: [{
      label: "Tables",
      data: [
        tables.filter(t => t.enabled && !t.inUse).length,
        tables.filter(t => t.inUse).length,
        tables.filter(t => !t.enabled).length
      ],
      backgroundColor: ["#22c55e", "#ef4444", "#9ca3af"]
    }]
  };

  const topItems = [...(analytics.mostOrderedItems || [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const mostOrderedData = {
    labels: topItems.length
      ? topItems.map(i => i.name)
      : ["No Data"],

    datasets: [{
      label: "Orders",
      data: topItems.length
        ? topItems.map(i => i.count)
        : [0],
      backgroundColor: "#6366f1",
      borderRadius: 6
    }]
  };


  // Determine if dark mode is active
  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#cbd5e1" : "#64748b"; // Slate 300 vs Slate 500
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

  // Common Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor }
      }
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor }
      }
    }
  };

  // Specific Options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor }
      }
    }
  };


  const peakHours = analytics?.peakHours || [];

  const peakHoursData = {
    labels: peakHours.length
      ? peakHours.map(h => `${h.hour}:00`)
      : ["No Data"],

    datasets: [{
      label: "Orders",
      data: peakHours.length
        ? peakHours.map(h => Number(h.orders))
        : [0],
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 4
    }]
  };


  const revenueTimeline = analytics?.revenueTimeline || [];

  const revenueLineData = {
    labels: revenueTimeline.length
      ? revenueTimeline.map(r => r.label)
      : ["No Data"],

    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueTimeline.length
          ? revenueTimeline.map(r => Number(r.amount))
          : [0],
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#16a34a"
      }
    ]
  };




  return (
    <div className="dashboard-charts">
      <div className="chart-card">
        <h3>Order Status</h3>
        <Pie data={ordersPieData} options={pieOptions} />
      </div>

      <div className="chart-card">
        <h3>Table Usage</h3>
        <Bar data={tableBarData} options={commonOptions} />
      </div>

      <div className="chart-card">
        <h3>Most Ordered Items</h3>
        <Bar data={mostOrderedData} options={commonOptions} />
      </div>

      <div className="chart-card">
        <h3>Peak Hours</h3>
        <Line data={peakHoursData} options={commonOptions} />
      </div>

      <div className="chart-card full-width">
        <h3>Revenue Trend</h3>

        {revenueTimeline.length === 0 ? (
          <p style={{ textAlign: "center", color: textColor }}>
            No revenue data for selected range
          </p>
        ) : (
          <Line data={revenueLineData} options={commonOptions} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboardCharts;

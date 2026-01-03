import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function AdminDashboardCharts({ tables, orders }) {
  /* Orders pie */
  const orderStatusCount = {
    CREATED: orders.filter(o => o.status === "CREATED").length,
    IN_PROGRESS: orders.filter(o => o.status === "IN_PROGRESS").length,
    COMPLETED: orders.filter(o => o.status === "COMPLETED").length
  };

  const ordersPieData = {
    labels: ["Created", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          orderStatusCount.CREATED,
          orderStatusCount.IN_PROGRESS,
          orderStatusCount.COMPLETED
        ],
        backgroundColor: ["#f59e0b", "#2563eb", "#16a34a"]
      }
    ]
  };

  /* Tables bar */
  const tableBarData = {
    labels: ["Free", "In Use", "Disabled"],
    datasets: [
      {
        label: "Tables",
        data: [
          tables.filter(t => t.enabled && !t.inUse).length,
          tables.filter(t => t.inUse).length,
          tables.filter(t => !t.enabled).length
        ],
        backgroundColor: ["#22c55e", "#ef4444", "#9ca3af"]
      }
    ]
  };

  return (
    <div className="dashboard-charts">
      <div className="chart-card">
        <h3>Orders Status</h3>
        <Pie data={ordersPieData} />
      </div>

      <div className="chart-card">
        <h3>Tables Usage</h3>
        <Bar data={tableBarData} />
      </div>
    </div>
  );
}

export default AdminDashboardCharts;

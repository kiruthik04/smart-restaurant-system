import { useEffect, useState } from "react";
import { getTableAvailability } from "../api/reservationApi";
import "./TableAvailability.css";

function TableAvailability() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getTableAvailability({
      date: "2025-01-10",
      startTime: "18:00",
      endTime: "20:00",
      people: 4,
    })
      .then((res) => setTables(res.data))
      .catch(() => setError("Failed to load table availability"))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p>Loading tables...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="availability-container">
      <ul className="availability-list">
        {tables.map((table, index) => (
          <li key={index} className="availability-item">
            <span className="table-number">
              Table {table.tableNumber}
            </span>

            <span
              className={`table-status ${table.available
                ? "status-available"
                : "status-booked"
                }`}
            >
              {table.available ? "Available" : "Booked"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TableAvailability;

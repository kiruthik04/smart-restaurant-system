import { useEffect, useState } from "react";
import { getTableAvailability } from "../api/reservationApi";

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

    <div>
      <h2>Table Availability</h2>
      <ul>
        {tables.map((table, index) => (
          <li key={index}>
            Table {table.tableNumber} –{" "}
            {table.available ? "Available" : "Booked"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TableAvailability;

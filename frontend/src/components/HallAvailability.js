import { useEffect, useState } from "react";
import { getHallAvailability } from "../api/eventApi";

function HallAvailability() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getHallAvailability({
      date: "2025-01-15",
      startTime: "18:00",
      endTime: "22:00",
      guests: 50,
    })
      .then((res) => setHalls(res.data))
      .catch(() => setError("Failed to load hall availability"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading halls...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Event Hall Availability</h2>

      <ul>
        {halls.map((hall, index) => (
          <li key={index}>
            {hall.hallName} (Capacity: {hall.capacity}) –{" "}
            {hall.available ? "Available" : "Booked"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HallAvailability;

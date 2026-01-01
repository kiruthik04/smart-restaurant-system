import { useEffect, useState } from "react";
import { getHallAvailability } from "../api/eventApi";
import "./HallAvailability.css";

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

  if (loading)
    return (
      <p className="hall-message">
        Loading halls...
      </p>
    );

  if (error)
    return (
      <p className="hall-error">
        {error}
      </p>
    );

  return (
    <div className="hall-availability-container">
      <ul className="hall-list">
        {halls.map((hall, index) => (
          <li key={index} className="hall-item">
            <div className="hall-info">
              <span className="hall-name">
                {hall.hallName}
              </span>
              <span className="hall-capacity">
                Capacity: {hall.capacity}
              </span>
            </div>

            <span
              className={`hall-status ${
                hall.available
                  ? "hall-available"
                  : "hall-booked"
              }`}
            >
              {hall.available ? "Available" : "Booked"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HallAvailability;

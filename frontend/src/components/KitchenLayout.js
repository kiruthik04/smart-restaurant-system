import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./KitchenLayout.css";

function KitchenLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="kitchen-layout">
      <header className="kitchen-header">
        <h1>Kitchen Dashboard</h1>

        <button className="kitchen-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="kitchen-content">
        {children}
      </main>
    </div>
  );
}

export default KitchenLayout;

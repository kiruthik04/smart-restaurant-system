import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { FaUserCircle } from "react-icons/fa";
import "./KitchenLayout.css";

function KitchenLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="kitchen-layout">
      <header className="kitchen-header">
        <h1>Kitchen Dashboard</h1>

        <div style={{ position: 'relative' }}>
          <button
            className="kitchen-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <FaUserCircle size={24} />
            <span>Kitchen Staff</span>
          </button>
          <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </header>

      <main className="kitchen-content">
        {children}
      </main>
    </div>
  );
}

export default KitchenLayout;

import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { FaUserCircle } from "react-icons/fa";
import "./KitchenLayout.css";

function KitchenLayout({ children }) {




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

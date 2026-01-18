import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import './ProfileModal.css';

function ProfileModal({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    return (
        <div className={`profile-modal-content ${user.role === 'CUSTOMER' ? 'customer-view' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={onClose}>&times;</button>

            <div className="profile-header">
                <div className="profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="profile-name">{user.name || user.username}</h2>
                <span className="profile-role">{user.role}</span>
            </div>



            {user.role !== 'CUSTOMER' && (
                <div className="theme-switcher">
                    <button
                        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => setTheme('light')}
                        title="Light Mode"
                    >
                        <FaSun />
                    </button>
                    <button
                        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => setTheme('dark')}
                        title="Dark Mode"
                    >
                        <FaMoon />
                    </button>
                    <button
                        className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                        onClick={() => setTheme('system')}
                        title="System Mode"
                    >
                        <FaDesktop />
                    </button>
                </div>
            )}

            <div className="profile-actions">
                <button
                    className="btn-change-password"
                    onClick={() => {
                        onClose();
                        navigate('/profile');
                    }}
                >
                    Edit Profile
                </button>
                <button
                    className="btn-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default ProfileModal;

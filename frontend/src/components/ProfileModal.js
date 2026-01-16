import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import './ProfileModal.css';

function ProfileModal({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/auth/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowChangePassword(false);
                setMessage({ type: '', text: '' });
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={onClose}>&times;</button>

            <div className="profile-header">
                <div className="profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="profile-name">{user.name || user.username}</h2>
                <span className="profile-role">{user.role}</span>
            </div>

            {message.text && (
                <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
                    {message.text}
                </div>
            )}

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

            {!showChangePassword ? (
                <div className="profile-actions">
                    <button
                        className="btn-change-password"
                        onClick={() => setShowChangePassword(true)}
                    >
                        Change Password
                    </button>
                    <button
                        className="btn-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <form className="change-password-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setShowChangePassword(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default ProfileModal;

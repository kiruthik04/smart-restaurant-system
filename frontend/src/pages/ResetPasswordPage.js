import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import './LoginPage.css'; // Reusing Login styles

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/api/auth/reset-password', { token, newPassword });
            setMessage(response.data);
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link might be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="login-full-screen">
                <div className="login-card">
                    <div className="error-message">Invalid or missing reset token.</div>
                    <Link to="/login" className="login-link">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="login-full-screen">
            <div className="login-card">
                <h2 className="login-title"><span className="gradient-text">New Password</span> 🔒</h2>

                {message && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-input"
                            placeholder="New strong password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

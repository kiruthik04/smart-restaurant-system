import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './LoginPage.css'; // Reusing Login styles for consistency

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-full-screen">
            <div className="login-card">
                <h2 className="login-title"><span className="gradient-text">Reset Password</span> 🔐</h2>

                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                    Enter your email to receive a password reset link.
                </p>

                {message && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="login-footer">
                    Remembered it?
                    <Link to="/login" className="login-link">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

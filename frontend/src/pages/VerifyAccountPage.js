import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './LoginPage.css';

const VerifyAccountPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email to send OTP.');
            return;
        }
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/api/auth/resend-verification', { email });
            setMessage(`OTP sent to ${email}. Please check your inbox.`);
            setOtpSent(true);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Failed to send OTP. Please check the email provided.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/api/auth/verify-registration', { email, otp });
            setMessage('Account verified successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Verification failed. Invalid OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-full-screen">
            <div className="login-card">
                <h2 className="login-title"><span className="gradient-text">Verify Account</span> 🔐</h2>

                {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {!otpSent ? (
                    // Step 1: Send OTP
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    // Step 2: Verify OTP
                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="form-input"
                                style={{ backgroundColor: '#f0f0f0', color: '#666', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="form-input"
                                placeholder="Enter 6-digit OTP"
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify & Login'}
                        </button>

                        <button
                            type="button"
                            onClick={handleSendOtp}
                            className="login-btn"
                            style={{ marginTop: '10px', backgroundColor: 'transparent', color: '#eab308', border: '1px solid #eab308' }}
                            disabled={isLoading}
                        >
                            Resend OTP
                        </button>
                    </form>
                )}

                <p className="login-footer">
                    Back to <a href="/login" className="login-link">Login</a>
                </p>
            </div>
        </div>
    );
};

export default VerifyAccountPage;

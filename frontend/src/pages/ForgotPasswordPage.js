import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './LoginPage.css'; // Reusing Login styles for consistency

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/forgot-password', { email });
            setMessage(response.data);
            setTimeout(() => {
                setMessage('');
                setStep(2);
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/verify-otp', { email, otp });
            setMessage(response.data);
            setTimeout(() => {
                setMessage('');
                setStep(3);
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/api/auth/reset-password', { email, otp, newPassword });
            setMessage(response.data);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <form onSubmit={handleSendOtp}>
            <div className="form-group">
                <label className="form-label">Email Address or Mobile Number</label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Email or Mobile"
                    required
                />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
        </form>
    );

    const renderStep2 = () => (
        <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                />
            </div>
            <div className="resend-link" style={{ textAlign: 'right', marginTop: '5px' }}>
                <button type="button" onClick={handleSendOtp} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>
                    Resend OTP
                </button>
            </div>
            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: '15px' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
        </form>
    );

    const renderStep3 = () => (
        <form onSubmit={handleResetPassword}>
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
    );

    return (
        <div className="login-full-screen">
            <div className="login-card">
                <h2 className="login-title">
                    <span className="gradient-text">
                        {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
                    </span> 🔐
                </h2>

                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                    {step === 1 && "Enter your email to receive an OTP."}
                    {step === 2 && `An OTP has been sent to ${email}.`}
                    {step === 3 && "Create a new password for your account."}
                </p>

                {message && <div className="success-message" style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                <p className="login-footer">
                    Remembered it?
                    <Link to="/login" className="login-link">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

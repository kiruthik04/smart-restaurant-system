import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: ''
    });

    // Password change state
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Email Verification State
    const [verification, setVerification] = useState({
        showOtpInput: false,
        otp: '',
        newEmail: '',
        newMobile: '',
        type: '' // 'EMAIL' or 'MOBILE'
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobileNumber: user.mobileNumber || ''
            });
        }
    }, [user]);

    const handleDataChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            const response = await api.put('/api/auth/profile', formData);

            // Check if OTP was sent for email change
            if (response.data.status === 'OTP_SENT') {
                setVerification({
                    showOtpInput: true,
                    otp: '',
                    newEmail: formData.email
                });
                setMessage({ type: 'success', text: response.data.message });
                // We update the name part immediately if returned
                updateUser({
                    name: response.data.name,
                    username: response.data.username,
                    role: response.data.role,
                    id: response.data.id,
                    email: user.email, // Keep old email until verified
                    mobileNumber: user.mobileNumber
                });
            } else if (response.data.status === 'OTP_SENT_MOBILE') {
                setVerification({
                    showOtpInput: true,
                    otp: '',
                    newMobile: formData.mobileNumber,
                    type: 'MOBILE'
                });
                setMessage({ type: 'success', text: response.data.message });
                updateUser({
                    name: response.data.name,
                    username: response.data.username,
                    role: response.data.role,
                    id: response.data.id,
                    email: user.email,
                    mobileNumber: user.mobileNumber // Keep old mobile until verified
                });
            } else {
                updateUser(response.data);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyContact = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const endpoint = verification.type === 'MOBILE'
                ? '/api/auth/verify-mobile-change'
                : '/api/auth/verify-email-change';

            const response = await api.post(endpoint, {
                otp: verification.otp
            });

            if (response.data.success) {
                if (verification.type === 'MOBILE') {
                    updateUser({ ...user, mobileNumber: response.data.mobileNumber });
                } else {
                    updateUser({ ...user, email: response.data.email });
                }
                setVerification({ showOtpInput: false, otp: '', newEmail: '', newMobile: '', type: '' });
                setMessage({ type: 'success', text: `${verification.type === 'MOBILE' ? 'Mobile' : 'Email'} verified and updated successfully!` });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data || 'Invalid OTP' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
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
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="profile-container">Loading...</div>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <div className="profile-header-section">
                    <div className="profile-avatar-large">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h2>My Profile</h2>
                    <p className="profile-role-badge">{user.role}</p>
                </div>

                {message.text && (
                    <div className={`message-banner ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-sections">
                    <div className="profile-section">
                        <h3>Edit Details</h3>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleDataChange}
                                    className="modal-input"
                                    placeholder="Your Name"
                                    disabled={verification.showOtpInput}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleDataChange}
                                    placeholder="your@email.com"
                                    disabled={verification.showOtpInput}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber || ''}
                                    onChange={handleDataChange}
                                    className="modal-input"
                                    placeholder="1234567890"
                                    disabled={verification.showOtpInput}
                                />
                            </div>

                            {!verification.showOtpInput ? (
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Details'}
                                </button>
                            ) : (
                                <div className="otp-verification-section">
                                    <p className="otp-info">
                                        Enter the 6-digit OTP sent to {verification.type === 'MOBILE' ? verification.newMobile : verification.newEmail}
                                    </p>
                                    <input
                                        type="text"
                                        className="modal-input otp-input"
                                        placeholder="Enter OTP"
                                        value={verification.otp}
                                        onChange={(e) => setVerification({ ...verification, otp: e.target.value })}
                                    />
                                    <div className="otp-actions">
                                        <button type="button" className="save-btn" onClick={handleVerifyContact} disabled={loading}>
                                            Verify & Update
                                        </button>
                                        <button type="button" className="back-btn" onClick={() => setVerification({ showOtpInput: false, otp: '', newEmail: '', newMobile: '', type: '' })}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="profile-divider"></div>

                    <div className="profile-section">
                        <h3>Change Password</h3>
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwords.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="modal-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordChange}
                                    className="modal-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="modal-input"
                                />
                            </div>
                            <button type="submit" className="change-pw-btn" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="profile-footer-actions">
                    <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
                    <button className="logout-btn-danger" onClick={() => { logout(); navigate('/'); }}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'CUSTOMER' // Force role to CUSTOMER
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(formData);
        if (result.success) {
            alert("Registration successful! Please login.");
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="signup-full-screen">
            <div className="signup-card">
                <h2 className="signup-title"><span className="gradient-text">Join the Fam!</span> 🍔</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <button type="submit" className="signup-btn">
                        Sign Up
                    </button>
                </form>
                <p className="signup-footer">
                    Already have an account?
                    <Link to="/login" className="signup-link">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;

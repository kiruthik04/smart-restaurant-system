import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // Assuming you might want styles, or inline them

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password);
        if (result.success) {
            if (result.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else if (result.role === 'KITCHEN') {
                navigate('/kitchen', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-full-screen">
            <div className="login-card">
                <h2 className="login-title"><span className="gradient-text">Hello Again!</span> 👋</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account?
                    <Link to="/signup" className="login-link">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

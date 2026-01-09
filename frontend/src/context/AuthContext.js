import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { clearOrderSession } from '../utils/session';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            // Set default header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/api/auth/login', { username, password });
            const { token, role, username: dbUsername, userId } = response.data;

            const userData = { username: dbUsername, role, id: userId };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            return { success: true, role: role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearOrderSession(); // Clear public order session
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const register = async (userData) => {
        try {
            await api.post('/api/auth/register', userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data || 'Registration failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

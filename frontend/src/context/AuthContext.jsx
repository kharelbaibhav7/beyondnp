import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager } from '../services/tokenManager.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Token validation function
    const isTokenValid = (token) => {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };

    useEffect(() => {
        // Check for existing token on app load
        const storedToken = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (storedToken && userData && isTokenValid(storedToken)) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setToken(storedToken);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                clearAuthData();
            }
        } else if (storedToken && !isTokenValid(storedToken)) {
            // Token is expired, clear it
            clearAuthData();
        }

        setLoading(false);
    }, []);

    const clearAuthData = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        tokenManager.clearToken();
    };

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        tokenManager.setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        clearAuthData();
    };

    const getToken = () => {
        return token;
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        token,
        login,
        logout,
        getToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

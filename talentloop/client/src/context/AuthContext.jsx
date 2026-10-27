import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('talentloop_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('talentloop_token'));
  const [loading, setLoading] = useState(true);

  // Sync token and fetch fresh profile on startup
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('talentloop_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('talentloop_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('talentloop_token', receivedToken);
    localStorage.setItem('talentloop_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('talentloop_token', receivedToken);
    localStorage.setItem('talentloop_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('talentloop_token');
    localStorage.removeItem('talentloop_user');
  };

  const updateProfile = async (formData) => {
    const res = await api.put('/auth/profile', formData);
    setUser(res.data.user);
    localStorage.setItem('talentloop_user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('talentloop_user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

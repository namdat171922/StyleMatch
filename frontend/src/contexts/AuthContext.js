import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function formatApiErrorDetail(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, full_name, role = 'customer') => {
    try {
      const { data } = await axios.post(
        `${API}/auth/register`,
        { email, password, full_name, role },
        { withCredentials: true }
      );
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: formatApiErrorDetail(error.response?.data?.detail) || error.message,
      };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: formatApiErrorDetail(error.response?.data?.detail) || error.message,
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

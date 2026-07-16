'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authLogin, authRegister, authMe } from '@/services/api';

const STORAGE_KEY = 'winlytics_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) { setLoading(false); return; }

    authMe(token)
      .then((u) => setUser({ ...u, token }))
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { token, user: u } = await authLogin({ email, password });
      localStorage.setItem(STORAGE_KEY, token);
      setUser({ ...u, token });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail ?? 'Login failed';
      return { success: false, error: detail };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    try {
      const { token, user: u } = await authRegister({ name, email, password });
      localStorage.setItem(STORAGE_KEY, token);
      setUser({ ...u, token });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail ?? 'Registration failed';
      return { success: false, error: detail };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

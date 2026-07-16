import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, registerLogoutCallback } from '../services/api';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const handleLogout = React.useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
      showToast('Session logged out successfully', 'info');
    }
  }, [showToast]);

  const checkSession = React.useCallback(async () => {
    try {
      const res = await api.post('/auth/refresh');
      const { accessToken, user: fetchedUser } = res.data;
      setAccessToken(accessToken);
      setUser(fetchedUser);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    registerLogoutCallback(() => {
      setUser(null);
      showToast('Session expired. Please log in again.', 'warning');
    });

    checkSession();
  }, [checkSession, showToast]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, rememberMe });
      const { accessToken, user: loggedUser } = res.data;
      setAccessToken(accessToken);
      setUser(loggedUser);
      showToast('Logged in successfully', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await handleLogout();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkSession,
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

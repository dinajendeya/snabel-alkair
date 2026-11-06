import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, UserRole } from '../types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate?: string | null;
  governorate?: string | null;
  address?: string | null;
  bio?: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  returnUrl: string | null;
  setReturnUrl: (url: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('senabil_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('senabil_token');
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [returnUrl, setReturnUrlState] = useState<string | null>(() => {
    return sessionStorage.getItem('senabil_return_url');
  });

  const setReturnUrl = (url: string | null) => {
    if (url) {
      sessionStorage.setItem('senabil_return_url', url);
    } else {
      sessionStorage.removeItem('senabil_return_url');
    }
    setReturnUrlState(url);
  };

  const refreshUser = async () => {
    try {
      if (!token) return;
      const res = await api.get('/users/me');
      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('senabil_user', JSON.stringify(res.data.user));
      }
    } catch {
      // If refresh fails, token could be expired
      setUser(null);
      setToken(null);
      localStorage.removeItem('senabil_token');
      localStorage.removeItem('senabil_user');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('senabil_token', newToken);
        localStorage.setItem('senabil_user', JSON.stringify(newUser));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to login. Please check your credentials.',
      };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data?.success) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('senabil_token', newToken);
        localStorage.setItem('senabil_user', JSON.stringify(newUser));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please verify your details.',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('senabil_token');
      localStorage.removeItem('senabil_user');
      sessionStorage.removeItem('senabil_return_url');
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('senabil_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        returnUrl,
        setReturnUrl,
        login,
        register,
        logout,
        updateUser,
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


import React, { createContext, useState, useEffect } from 'react';
import { login, register } from '../services/authService'

interface AuthContextType {
  user: any;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const data = await login(email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const data = await register(name, email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

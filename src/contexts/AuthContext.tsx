import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'employee';
  firstName: string;
  lastName: string;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to your ASP.NET backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      
      // Mock login for demo - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock user data based on credentials
      let mockUser: User;
      if (username === 'admin' && password === 'admin') {
        mockUser = {
          id: '1',
          username: 'admin',
          email: 'admin@certifyone.com',
          role: 'admin',
          firstName: 'System',
          lastName: 'Administrator',
          department: 'IT',
        };
      } else if (username === 'employee' && password === 'employee') {
        mockUser = {
          id: '2',
          username: 'employee',
          email: 'john.doe@certifyone.com',
          role: 'employee',
          firstName: 'John',
          lastName: 'Doe',
          department: 'Engineering',
        };
      } else {
        throw new Error('Invalid credentials');
      }

      // Store token and user data
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('auth-token', mockToken);
      localStorage.setItem('user-data', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
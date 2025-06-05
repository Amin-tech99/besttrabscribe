import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for testing - will be replaced with real API calls in production
export const mockUsers = [
  {
    id: '1',
    name: 'Super Administrator',
    email: 'superadmin@hassaniya.com',
    role: 'super-admin' as const,
    avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
    password: 'SuperAdmin2024!'
  },
  {
    id: '2',
    name: 'System Administrator',
    email: 'admin@hassaniya.com',
    role: 'admin' as const,
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=059669&color=fff',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
    password: 'Admin2024!'
  },
  {
    id: '3',
    name: 'Transcription Worker',
    email: 'worker@hassaniya.com',
    role: 'worker' as const,
    avatar: 'https://ui-avatars.com/api/?name=Worker&background=dc2626&color=fff',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
    password: 'Worker2024!'
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkSession = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user was previously logged in
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching email and password
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = user;
      const authenticatedUser = {
        ...userWithoutPassword,
        lastActive: new Date()
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      
      // Production: Replace with real API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Invalid credentials');
      // }
      // 
      // const userData = await response.json();
      // setUser(userData.user);
      // localStorage.setItem('currentUser', JSON.stringify(userData.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
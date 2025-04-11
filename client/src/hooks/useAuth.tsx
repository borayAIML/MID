import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { useLocation } from 'wouter';

type User = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  companyId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  // Get the current authentication status from the server
  const { data, isLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/user', { method: 'GET' });
        if (response && response.success) {
          return {
            user: response.user,
            companyId: response.companyId || null
          };
        }
        return { user: null, companyId: null };
      } catch (error) {
        return { user: null, companyId: null };
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      const response = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Login failed');
      }
      
      return {
        user: response.user,
        companyId: response.companyId
      };
    },
    onSuccess: (data) => {
      // Update localStorage for compatibility with existing code
      localStorage.setItem('userData', JSON.stringify(data.user));
      if (data.companyId) {
        localStorage.setItem('companyId', data.companyId.toString());
      }
      
      // Invalidate and refetch the auth query
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // Trigger a storage event for App to detect the login
      window.dispatchEvent(new Event('storage'));
      
      toast({
        title: 'Login successful',
        description: 'Welcome back! You have been logged in successfully.',
        variant: 'default',
      });
      
      // Navigate to the dashboard
      navigate('/valuation');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/logout', {
        method: 'POST',
      });
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Logout failed');
      }
      
      return response;
    },
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('companyId');
      localStorage.removeItem('businessData');
      localStorage.removeItem('userId');
      
      // Invalidate and refetch the auth query
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      // Trigger the logout event
      window.dispatchEvent(new Event('logout'));
      
      toast({
        title: 'Logout successful',
        description: 'You have been logged out successfully.',
        variant: 'default',
      });
      
      // Navigate to the home page
      navigate('/');
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout.',
        variant: 'destructive',
      });
    }
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Provide the auth context value
  const authContextValue: AuthContextType = {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user,
    companyId: data?.companyId || null,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
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

export default useAuth;
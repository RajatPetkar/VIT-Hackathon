
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { users } from './mock-data';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      // Here we're just using mock data
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just check if the email exists in our mock data
      // and assume the password is "password" for all users
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password.',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'An unexpected error occurred.',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Higher order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) => {
  return (props: P) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const [redirecting, setRedirecting] = useState(false);
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        setRedirecting(true);
        // Redirect to login after a short delay
        const timer = setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        return () => clearTimeout(timer);
      }
      
      if (!isLoading && isAuthenticated && allowedRoles && !allowedRoles.includes(user!.role)) {
        setRedirecting(true);
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
        });
        // Redirect to dashboard after a short delay
        const timer = setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isLoading, isAuthenticated, user]);
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20"></div>
            <div className="h-4 w-24 bg-muted rounded"></div>
          </div>
        </div>
      );
    }
    
    if (redirecting) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    if (allowedRoles && !allowedRoles.includes(user!.role)) {
      return null;
    }
    
    return <Component {...props} />;
  };
};

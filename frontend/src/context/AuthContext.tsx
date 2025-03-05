import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, AuthState, SignInCredentials, SignUpCredentials } from '../types/auth';
import api from '../services/api';

const mockAuthApi = {
  signUp: async (credentials: SignUpCredentials): Promise<User> => {
    const response = await api.post('/users', {
      user: {
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.password_confirmation,
      },
    });
    const token = response.data.token;
    const user = response.data.user;
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  signIn: async (credentials: SignInCredentials): Promise<User> => {
    const response = await api.post('/users/sign_in', {
      user: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    const token = response.data.token;
    const user = response.data.user;
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  signInWithGoogle: async (): Promise<void> => {
    window.location.href = 'http://localhost:3000/users/auth/google_oauth2';
  },

  signOut: async (): Promise<void> => {
    const token = localStorage.getItem('token');
    await api.delete('/users/sign_out', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) return JSON.parse(storedUser);

    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await api.get('/api/check_auth', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = response.data.user;
    if (user) localStorage.setItem('user', JSON.stringify(user));
    return user || null;
  },
};

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Extract token and user data from query parameters if present
        const queryParams = new URLSearchParams(location.search);
        const tokenFromQuery = queryParams.get('jwt');
        const userFromQuery = queryParams.get('user'); // Fixed key from 'user_json' to 'user'
  
        // If the query parameters exist and localStorage is empty, store them
        if (tokenFromQuery && userFromQuery && 
            !localStorage.getItem('token') && !localStorage.getItem('user')) {
          localStorage.setItem('token', tokenFromQuery);
          localStorage.setItem('user', userFromQuery);
  
          // Clean up URL by navigating without query parameters and exit early
          navigate('/dashboard', { replace: true });
          return;
        }
  
        // Fetch current user from your API
        const user = await mockAuthApi.getCurrentUser();
  
        // Update state with user info
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
  
        // If user is on the dashboard route, ensure proper state or redirect if not authenticated
        if (location.pathname === '/dashboard' && user) {
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
        } else if (location.pathname === '/dashboard' && !user) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to load user',
        });
        if (location.pathname === '/dashboard') {
          navigate('/login');
        }
      }
    };
  
    loadUser();
  }, [location.pathname, location.search, navigate]);
  

  const signIn = async (credentials: SignInCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await mockAuthApi.signIn(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      navigate('/dashboard');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid credentials',
      }));
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await mockAuthApi.signUp(credentials);
      localStorage.setItem('user', JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      navigate('/dashboard');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed',
      }));
    }
  };

  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await mockAuthApi.signInWithGoogle();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Google sign-in failed',
      }));
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await mockAuthApi.signOut();
      localStorage.removeItem('user');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      navigate('/');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Sign out failed',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
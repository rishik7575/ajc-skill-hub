import { useState, useCallback } from 'react';
import { User, STORAGE_KEYS } from './mockData';
import { secureStorage, RateLimiter, validateToken } from './security';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Mock authentication service
export class AuthService {

  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      // Save user and token to local storage
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async signup(data: SignupData): Promise<{ user: User; token: string } | null> {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || 'Signup failed');
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, resData);
      return resData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  static logout(): void {
    secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Debug method to reset rate limiting
  static resetRateLimit(email?: string): void {
    RateLimiter.reset(email);
  }

  static getCurrentUser(): { user: User; token: string } | null {
    try {
      const data = secureStorage.getItem<{ user: User; token: string }>(STORAGE_KEYS.CURRENT_USER);
      if (!data) return null;

      // Validate token
      if (!validateToken(data.token)) {
        console.warn('Invalid or expired token, clearing storage');
        secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return null;
      }

      // Validate the structure of the data
      if (!data.user || !data.token) {
        console.warn('Invalid user data structure, clearing storage');
        secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
  }

  static isAuthenticated(): boolean {
    try {
      const currentUser = this.getCurrentUser();
      return !!(currentUser && currentUser.user && currentUser.token);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  static isAdmin(): boolean {
    try {
      const current = this.getCurrentUser();
      return current?.user.role === 'admin' || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  static isFaculty(): boolean {
    try {
      const current = this.getCurrentUser();
      return current?.user.role === 'faculty' || false;
    } catch (error) {
      console.error('Error checking faculty status:', error);
      return false;
    }
  }

}

// Auth context hook with proper state management
export const useAuth = () => {
  const [authState, setAuthState] = useState(() => {
    try {
      const currentUser = AuthService.getCurrentUser();
      return {
        user: currentUser?.user || null,
        token: currentUser?.token || null,
        isAuthenticated: AuthService.isAuthenticated(),
        isAdmin: AuthService.isAdmin(),
        isLoading: false
      };
    } catch (error) {
      console.error('Error initializing auth state:', error);
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false
      };
    }
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await AuthService.login(credentials);
      if (result && result.user && result.token) {
        setAuthState({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isAdmin: result.user.role === 'admin',
          isLoading: false
        });
        return result;
      }
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false
      }));
      return null;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false
      }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await AuthService.signup(data);
      if (result && result.user && result.token) {
        setAuthState({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isAdmin: result.user.role === 'admin',
          isLoading: false
        });
        return result;
      }
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false
      }));
      return null;
    } catch (error) {
      console.error('Signup error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false
    });
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout
  };
};
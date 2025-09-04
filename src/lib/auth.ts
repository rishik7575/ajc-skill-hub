import { useState, useCallback } from 'react';
import { User, getUserData, saveUserData, STORAGE_KEYS } from './mockData';

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
  private static readonly ADMIN_EMAIL = 'rishikmaduri@gmail.com';
  private static readonly ADMIN_PASSWORD = 'Rishik@123';

  static login(credentials: LoginCredentials): { user: User; token: string } | null {
    const { email, password } = credentials;
    
    // Admin login
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin',
        email: this.ADMIN_EMAIL,
        name: 'Rishik Maduri',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      const token = this.generateToken(adminUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ user: adminUser, token }));
      return { user: adminUser, token };
    }
    
    // Student login - check if user exists
    const users = getUserData();
    const user = users.find(u => u.email === email);
    
    if (user && this.validatePassword(password)) {
      const token = this.generateToken(user);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ user, token }));
      return { user, token };
    }
    
    return null;
  }

  static signup(data: SignupData): { user: User; token: string } | null {
    try {
      const users = getUserData();

      // Check if user already exists
      if (users.find(u => u.email === data.email)) {
        throw new Error('An account with this email already exists');
      }

      // Validate input data
      if (!data.email || !data.name || !data.password) {
        throw new Error('All fields are required');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const newUser: User = {
        id: `student_${Date.now()}`,
        email: data.email,
        name: data.name,
        role: 'student',
        enrolledCourses: [],
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUserData(users);

      const token = this.generateToken(newUser);
      const userData = { user: newUser, token };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static getCurrentUser(): { user: User; token: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Validate the structure of the parsed data
      if (!parsed || typeof parsed !== 'object' || !parsed.user || !parsed.token) {
        console.warn('Invalid user data structure, clearing localStorage');
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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

  private static generateToken(user: User): string {
    // Simple mock token - in real app, this would be a JWT
    return btoa(`${user.id}:${user.email}:${Date.now()}`);
  }

  private static validatePassword(password: string): boolean {
    // Simple validation - in real app, passwords would be hashed
    return password.length >= 1; // Accept any password for demo
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
      const result = AuthService.login(credentials);
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
      const result = AuthService.signup(data);
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
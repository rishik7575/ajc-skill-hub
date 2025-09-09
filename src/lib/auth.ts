import { useState, useCallback } from 'react';
import { User, getUserData, saveUserData, STORAGE_KEYS } from './mockData';
import { validateEmail, validatePasswordStrength, generateSecureToken, validateToken, secureStorage, RateLimiter } from './security';

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

    console.log('Login attempt:', { email, passwordLength: password.length });

    // Rate limiting - more lenient for demo
    if (!RateLimiter.isAllowed(email, 10, 15 * 60 * 1000)) {
      console.log('Rate limit exceeded for:', email);
      throw new Error('Too many login attempts. Please try again later.');
    }

    // Input validation
    if (!validateEmail(email)) {
      console.log('Invalid email format:', email);
      throw new Error('Invalid email format');
    }

    // Admin login
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      console.log('Admin login successful');
      const adminUser: User = {
        id: 'admin',
        email: this.ADMIN_EMAIL,
        name: 'Rishik Maduri',
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      const token = generateSecureToken({ userId: adminUser.id, role: adminUser.role });
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, { user: adminUser, token });
      return { user: adminUser, token };
    }

    // Check faculty credentials
    const facultyData = localStorage.getItem(STORAGE_KEYS.FACULTY);
    const faculty = facultyData ? JSON.parse(facultyData) : [];
    const facultyUser = faculty.find((f: any) => f.email === email && f.password === password);
    
    if (facultyUser) {
      console.log('Faculty login successful');
      const facultyUserData: User = {
        id: facultyUser.id,
        email: facultyUser.email,
        name: facultyUser.name,
        role: 'faculty',
        assignedCourses: facultyUser.assignedCourses,
        createdAt: new Date().toISOString()
      };
      const token = generateSecureToken({ userId: facultyUserData.id, role: facultyUserData.role });
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, { user: facultyUserData, token });
      return { user: facultyUserData, token };
    }

    // Student login - check if user exists
    const users = getUserData();
    console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
    const user = users.find(u => u.email === email);

    if (user) {
      console.log('User found:', { email: user.email, role: user.role });
      // Check if password matches (for demo, we store plain text passwords)
      if (this.validateStudentPassword(password, user.password)) {
        console.log('Student login successful');
        const token = generateSecureToken({ userId: user.id, role: user.role });
        secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, { user, token });
        return { user, token };
      } else {
        console.log('Password validation failed. Expected:', user.password, 'Got:', password);
      }
    } else {
      console.log('User not found for email:', email);
    }

    return null;
  }

  static signup(data: SignupData): { user: User; token: string } | null {
    try {
      const users = getUserData();

      // Rate limiting
      if (!RateLimiter.isAllowed(data.email, 3, 60 * 60 * 1000)) {
        throw new Error('Too many signup attempts. Please try again later.');
      }

      // Input validation
      if (!validateEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      // Check if user already exists
      if (users.find(u => u.email === data.email)) {
        throw new Error('An account with this email already exists');
      }

      // Validate input data
      if (!data.email || !data.name || !data.password) {
        throw new Error('All fields are required');
      }

      // Enhanced password validation
      const passwordValidation = validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0]);
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

      const token = generateSecureToken({ userId: newUser.id, role: newUser.role });
      const userData = { user: newUser, token };
      secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, userData);
      return userData;
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

  private static generateToken(user: User): string {
    // Simple mock token - in real app, this would be a JWT
    return btoa(`${user.id}:${user.email}:${Date.now()}`);
  }

  private static validatePassword(password: string): boolean {
    // Simple validation - in real app, passwords would be hashed
    return password.length >= 1; // Accept any password for demo
  }

  private static validateStudentPassword(inputPassword: string, storedPassword?: string): boolean {
    // For demo purposes, check against stored password or accept any password if none stored
    if (!storedPassword) {
      return inputPassword.length >= 1; // Fallback for users without stored passwords
    }
    return inputPassword === storedPassword;
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
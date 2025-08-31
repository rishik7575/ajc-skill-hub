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
    const users = getUserData();
    
    // Check if user already exists
    if (users.find(u => u.email === data.email)) {
      return null;
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
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ user: newUser, token }));
    return { user: newUser, token };
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static getCurrentUser(): { user: User; token: string } | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isAdmin(): boolean {
    const current = this.getCurrentUser();
    return current?.user.role === 'admin';
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

// Auth context hook
export const useAuth = () => {
  const currentUser = AuthService.getCurrentUser();
  
  return {
    user: currentUser?.user || null,
    token: currentUser?.token || null,
    isAuthenticated: AuthService.isAuthenticated(),
    isAdmin: AuthService.isAdmin(),
    login: AuthService.login,
    signup: AuthService.signup,
    logout: AuthService.logout
  };
};
// Security utilities for production deployment

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation with security considerations
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitizedEmail = sanitizeInput(email);
  
  return emailRegex.test(sanitizedEmail) && 
         sanitizedEmail.length <= 254 && // RFC 5321 limit
         !sanitizedEmail.includes('..') && // No consecutive dots
         !sanitizedEmail.startsWith('.') && // No leading dot
         !sanitizedEmail.endsWith('.'); // No trailing dot
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Secure token generation (mock implementation)
export const generateSecureToken = (payload: Record<string, unknown>): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }));
  
  // In production, use a proper JWT library with secret key
  const signature = btoa(`${header}.${encodedPayload}.mock-signature`);
  
  return `${header}.${encodedPayload}.${signature}`;
};

// Token validation
export const validateToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch {
    return false;
  }
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key: string, value: unknown): void => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const serializedValue = JSON.stringify(value);
      
      // Add timestamp for expiration checking
      const dataWithTimestamp = {
        data: serializedValue,
        timestamp: Date.now(),
        checksum: btoa(serializedValue) // Simple integrity check
      };
      
      localStorage.setItem(sanitizedKey, JSON.stringify(dataWithTimestamp));
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  },
  
  getItem: <T>(key: string): T | null => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const item = localStorage.getItem(sanitizedKey);
      
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Verify integrity
      if (parsed.checksum !== btoa(parsed.data)) {
        console.warn('Data integrity check failed');
        localStorage.removeItem(sanitizedKey);
        return null;
      }
      
      // Check if data is older than 7 days
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp > sevenDays) {
        localStorage.removeItem(sanitizedKey);
        return null;
      }
      
      return JSON.parse(parsed.data);
    } catch (error) {
      console.error('Secure storage retrieval error:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    const sanitizedKey = sanitizeInput(key);
    localStorage.removeItem(sanitizedKey);
  },
  
  clear: (): void => {
    localStorage.clear();
  }
};

// Rate limiting for API calls
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();

  static isAllowed(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const userRequests = this.requests.get(identifier)!;

    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);

    if (validRequests.length >= maxRequests) {
      console.log(`Rate limit exceeded for ${identifier}: ${validRequests.length}/${maxRequests}`);
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  static reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
      console.log(`Rate limit reset for ${identifier}`);
    } else {
      this.requests.clear();
      console.log('All rate limits reset');
    }
  }
}

// Content Security Policy helpers
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Note: unsafe-inline should be removed in production
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// XSS protection
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// CSRF token generation (for forms)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Environment-based security settings
export const SECURITY_CONFIG = {
  isProduction: process.env.NODE_ENV === 'production',
  enableCSP: true,
  enableHSTS: true,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};

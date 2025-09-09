// CORS configuration for production deployment

export const CORS_CONFIG = {
  // Allowed origins for production
  allowedOrigins: [
    'https://ajc-skill-hub.vercel.app',
    'https://ajc-skill-hub.netlify.app',
    'https://ajc-skill-hub.com',
    'https://www.ajc-skill-hub.com',
    // Add your production domains here
  ],
  
  // Development origins
  developmentOrigins: [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
  ],
  
  // Allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
  ],
  
  // Credentials support
  credentials: true,
  
  // Preflight cache duration (in seconds)
  maxAge: 86400, // 24 hours
};

// CORS middleware function for API routes
export const corsMiddleware = (origin: string): boolean => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    // Allow all origins in development
    return CORS_CONFIG.developmentOrigins.includes(origin) || origin === undefined;
  }
  
  // Strict origin checking in production
  return CORS_CONFIG.allowedOrigins.includes(origin);
};

// Security headers for production
export const SECURITY_HEADERS = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // X-Frame-Options
  'X-Frame-Options': 'DENY',
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // X-XSS-Protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()'
  ].join(', '),
  
  // Cross-Origin Embedder Policy
  'Cross-Origin-Embedder-Policy': 'require-corp',
  
  // Cross-Origin Opener Policy
  'Cross-Origin-Opener-Policy': 'same-origin',
  
  // Cross-Origin Resource Policy
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// Function to apply security headers
export const applySecurityHeaders = (): void => {
  if (typeof document !== 'undefined') {
    // Add meta tags for security headers that can be set via HTML
    const metaTags = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
      { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
      { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' },
    ];
    
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        meta.setAttribute(key, value);
      });
      document.head.appendChild(meta);
    });
  }
};

// Trusted domains for external resources
export const TRUSTED_DOMAINS = {
  fonts: ['fonts.googleapis.com', 'fonts.gstatic.com'],
  analytics: ['www.google-analytics.com', 'analytics.google.com'],
  cdn: ['cdn.jsdelivr.net', 'unpkg.com'],
  images: ['images.unsplash.com', 'via.placeholder.com'],
};

// Function to validate external URLs
export const isValidExternalUrl = (url: string, category: keyof typeof TRUSTED_DOMAINS): boolean => {
  try {
    const urlObj = new URL(url);
    return TRUSTED_DOMAINS[category].includes(urlObj.hostname);
  } catch {
    return false;
  }
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // API endpoints rate limits (requests per minute)
  login: 5,
  signup: 3,
  passwordReset: 2,
  contactForm: 10,
  feedback: 20,
  
  // Global rate limit
  global: 100,
  
  // Window duration in milliseconds
  windowMs: 60 * 1000, // 1 minute
  
  // Blocked duration for exceeded limits
  blockDuration: 15 * 60 * 1000, // 15 minutes
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    isProduction,
    isDevelopment,
    apiUrl: isProduction 
      ? 'https://api.ajc-skill-hub.com' 
      : 'http://localhost:3001',
    websiteUrl: isProduction 
      ? 'https://ajc-skill-hub.com' 
      : 'http://localhost:8080',
    enableLogging: !isProduction,
    enableDebug: isDevelopment,
    enableAnalytics: isProduction,
    enableErrorReporting: isProduction,
  };
};

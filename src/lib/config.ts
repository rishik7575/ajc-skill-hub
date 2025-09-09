// Production configuration and environment management

// Environment variables with defaults
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  VITE_APP_NAME: process.env.VITE_APP_NAME || 'AJC Skill Hub',
  VITE_APP_VERSION: process.env.VITE_APP_VERSION || '1.0.0',
  VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:3001',
  VITE_WEBSITE_URL: process.env.VITE_WEBSITE_URL || 'http://localhost:8080',
  VITE_ANALYTICS_ID: process.env.VITE_ANALYTICS_ID || '',
  VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN || '',
  VITE_ENABLE_ANALYTICS: process.env.VITE_ENABLE_ANALYTICS === 'true',
  VITE_ENABLE_ERROR_REPORTING: process.env.VITE_ENABLE_ERROR_REPORTING === 'true',
} as const;

// Application configuration
export const APP_CONFIG = {
  name: ENV.VITE_APP_NAME,
  version: ENV.VITE_APP_VERSION,
  description: 'Professional skill development platform with industry-focused internship programs',
  author: 'AJC Skill Hub Team',
  keywords: ['education', 'skills', 'internship', 'training', 'certification'],
  
  // URLs
  apiUrl: ENV.VITE_API_URL,
  websiteUrl: ENV.VITE_WEBSITE_URL,
  
  // Features
  features: {
    analytics: ENV.VITE_ENABLE_ANALYTICS,
    errorReporting: ENV.VITE_ENABLE_ERROR_REPORTING,
    darkMode: true,
    notifications: true,
    offlineSupport: false, // Can be enabled later
  },
  
  // Limits
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    rateLimit: {
      requests: 100,
      windowMs: 60 * 1000, // 1 minute
    },
  },
  
  // Contact information
  contact: {
    email: 'support@ajc-skill-hub.com',
    phone: '+91-XXXXXXXXXX',
    address: 'Your Address Here',
    supportHours: '9:00 AM - 6:00 PM IST',
  },
  
  // Social media
  social: {
    linkedin: 'https://linkedin.com/company/ajc-skill-hub',
    twitter: 'https://twitter.com/ajcskillhub',
    facebook: 'https://facebook.com/ajcskillhub',
    instagram: 'https://instagram.com/ajcskillhub',
  },
} as const;

// Database configuration (for future backend integration)
export const DB_CONFIG = {
  connectionTimeout: 30000,
  queryTimeout: 15000,
  maxConnections: 10,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 100, // Maximum number of cached items
  
  // Specific cache durations
  durations: {
    courses: 10 * 60 * 1000, // 10 minutes
    users: 5 * 60 * 1000, // 5 minutes
    feedback: 2 * 60 * 1000, // 2 minutes
    static: 60 * 60 * 1000, // 1 hour
  },
} as const;

// Logging configuration
export const LOG_CONFIG = {
  level: ENV.NODE_ENV === 'production' ? 'error' : 'debug',
  enableConsole: ENV.NODE_ENV !== 'production',
  enableFile: ENV.NODE_ENV === 'production',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  
  // Log categories
  categories: {
    auth: true,
    api: true,
    ui: ENV.NODE_ENV !== 'production',
    performance: true,
    security: true,
  },
} as const;

// Error handling configuration
export const ERROR_CONFIG = {
  enableReporting: ENV.VITE_ENABLE_ERROR_REPORTING,
  sentryDsn: ENV.VITE_SENTRY_DSN,
  
  // Error boundaries
  fallbackComponent: true,
  showErrorDetails: ENV.NODE_ENV !== 'production',
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
} as const;

// Performance monitoring
export const PERFORMANCE_CONFIG = {
  enableMonitoring: ENV.NODE_ENV === 'production',
  sampleRate: 0.1, // 10% of transactions
  
  // Thresholds
  thresholds: {
    pageLoad: 3000, // 3 seconds
    apiResponse: 1000, // 1 second
    renderTime: 100, // 100ms
  },
  
  // Metrics to track
  metrics: {
    pageViews: true,
    userInteractions: true,
    apiCalls: true,
    errors: true,
    performance: true,
  },
} as const;

// SEO configuration
export const SEO_CONFIG = {
  defaultTitle: 'AJC Skill Hub - Professional Skill Development Platform',
  titleTemplate: '%s | AJC Skill Hub',
  defaultDescription: 'Transform your career with industry-focused internship programs. Learn Power BI, Full Stack Development, and more with expert guidance.',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: ENV.VITE_WEBSITE_URL,
    siteName: 'AJC Skill Hub',
    images: [
      {
        url: `${ENV.VITE_WEBSITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'AJC Skill Hub - Professional Skill Development',
      },
    ],
  },
  
  // Twitter
  twitter: {
    handle: '@ajcskillhub',
    site: '@ajcskillhub',
    cardType: 'summary_large_image',
  },
  
  // Additional meta tags
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#3b82f6',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
  ],
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  // UI Features
  darkMode: true,
  animations: true,
  notifications: true,
  
  // Functionality
  courseEnrollment: true,
  certificateGeneration: true,
  feedbackSystem: true,
  progressTracking: true,
  
  // Experimental features
  aiChatbot: false,
  videoStreaming: false,
  liveClasses: false,
  mobileApp: false,
  
  // Admin features
  adminDashboard: true,
  userManagement: true,
  analyticsReporting: true,
  contentManagement: true,
} as const;

// Validation schemas
export const VALIDATION_CONFIG = {
  email: {
    maxLength: 254,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  phone: {
    pattern: /^[+]?[\d\s\-()]+$/,
    minLength: 10,
    maxLength: 15,
  },
} as const;

// Export environment check utilities
export const isProduction = () => ENV.NODE_ENV === 'production';
export const isDevelopment = () => ENV.NODE_ENV === 'development';
export const isTest = () => ENV.NODE_ENV === 'test';

// Configuration validation
export const validateConfig = (): boolean => {
  const requiredEnvVars = ['VITE_APP_NAME', 'VITE_WEBSITE_URL'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
      return false;
    }
  }
  
  return true;
};

// Initialize configuration
export const initializeConfig = (): void => {
  if (!validateConfig()) {
    throw new Error('Configuration validation failed');
  }
  
  // Set global configuration
  if (typeof window !== 'undefined') {
    (window as any).__APP_CONFIG__ = APP_CONFIG;
  }
  
  console.log(`🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} initialized in ${ENV.NODE_ENV} mode`);
};

// Production-ready logging service

import { LOG_CONFIG, ERROR_CONFIG, isProduction } from './config';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  stack?: string;
}

// Logger class
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupErrorHandlers();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.error('Global Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        });
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled Promise Rejection', {
          reason: event.reason,
          stack: event.reason?.stack,
        });
      });
    }
  }

  private createLogEntry(
    level: LogLevel,
    category: string,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('ajc_current_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.user?.id;
      }
    } catch {
      // Ignore errors
    }
    return undefined;
  }

  private shouldLog(level: LogLevel, category: string): boolean {
    const configLevel = this.getConfigLevel();
    const categoryEnabled = LOG_CONFIG.categories[category as keyof typeof LOG_CONFIG.categories];
    
    return level >= configLevel && (categoryEnabled !== false);
  }

  private getConfigLevel(): LogLevel {
    switch (LOG_CONFIG.level) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private log(level: LogLevel, category: string, message: string, data?: unknown): void {
    if (!this.shouldLog(level, category)) {
      return;
    }

    const entry = this.createLogEntry(level, category, message, data);
    
    // Add to internal log storage
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    if (LOG_CONFIG.enableConsole) {
      this.logToConsole(entry);
    }

    // Send to external service in production
    if (isProduction() && level >= LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const { level, category, message, data } = entry;
    const prefix = `[${LogLevel[level]}] [${category}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, message, data);
        break;
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // In a real application, send to your logging service
      // Example: Sentry, LogRocket, DataDog, etc.
      
      if (ERROR_CONFIG.enableReporting && ERROR_CONFIG.sentryDsn) {
        // Sentry integration would go here
        console.log('Would send to Sentry:', entry);
      }
      
      // You can also send to your own API endpoint
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  // Public logging methods
  public debug(message: string, data?: unknown, category = 'general'): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  public info(message: string, data?: unknown, category = 'general'): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  public warn(message: string, data?: unknown, category = 'general'): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  public error(message: string, data?: unknown, category = 'general'): void {
    this.log(LogLevel.ERROR, category, message, data);
  }

  public fatal(message: string, data?: unknown, category = 'general'): void {
    this.log(LogLevel.FATAL, category, message, data);
  }

  // Specialized logging methods
  public auth(message: string, data?: unknown): void {
    this.info(message, data, 'auth');
  }

  public api(message: string, data?: unknown): void {
    this.info(message, data, 'api');
  }

  public ui(message: string, data?: unknown): void {
    this.debug(message, data, 'ui');
  }

  public performance(message: string, data?: unknown): void {
    this.info(message, data, 'performance');
  }

  public security(message: string, data?: unknown): void {
    this.warn(message, data, 'security');
  }

  // Utility methods
  public getLogs(level?: LogLevel, category?: string): LogEntry[] {
    return this.logs.filter(log => {
      if (level !== undefined && log.level < level) return false;
      if (category && log.category !== category) return false;
      return true;
    });
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
export const logger = Logger.getInstance();

// Convenience functions
export const log = {
  debug: (message: string, data?: unknown, category?: string) => logger.debug(message, data, category),
  info: (message: string, data?: unknown, category?: string) => logger.info(message, data, category),
  warn: (message: string, data?: unknown, category?: string) => logger.warn(message, data, category),
  error: (message: string, data?: unknown, category?: string) => logger.error(message, data, category),
  fatal: (message: string, data?: unknown, category?: string) => logger.fatal(message, data, category),
  
  // Specialized
  auth: (message: string, data?: unknown) => logger.auth(message, data),
  api: (message: string, data?: unknown) => logger.api(message, data),
  ui: (message: string, data?: unknown) => logger.ui(message, data),
  performance: (message: string, data?: unknown) => logger.performance(message, data),
  security: (message: string, data?: unknown) => logger.security(message, data),
};

// Performance timing utility
export const performanceTimer = {
  start: (name: string): void => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  },
  
  end: (name: string): number => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = performance.getEntriesByName(name);
      const duration = entries.length > 0 ? entries[entries.length - 1].duration : 0;
      
      logger.performance(`${name} completed`, { duration: `${duration.toFixed(2)}ms` });
      
      return duration;
    }
    return 0;
  },
};

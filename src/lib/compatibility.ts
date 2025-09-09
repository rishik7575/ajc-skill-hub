// Cross-browser and device compatibility utilities

import { log } from './logger';

// Browser detection
export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
  supported: boolean;
}

// Device detection
export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile';
  orientation: 'portrait' | 'landscape';
  screenSize: {
    width: number;
    height: number;
  };
  pixelRatio: number;
  touchSupport: boolean;
}

// Feature detection results
export interface FeatureSupport {
  localStorage: boolean;
  sessionStorage: boolean;
  webGL: boolean;
  canvas: boolean;
  svg: boolean;
  flexbox: boolean;
  grid: boolean;
  customProperties: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  webWorkers: boolean;
  serviceWorkers: boolean;
  pushNotifications: boolean;
  geolocation: boolean;
  camera: boolean;
  microphone: boolean;
}

// Supported browsers configuration
const SUPPORTED_BROWSERS = {
  chrome: 90,
  firefox: 88,
  safari: 14,
  edge: 90,
  opera: 76,
  samsung: 14,
} as const;

// Browser detection utility
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  let name = 'unknown';
  let version = '0';
  let engine = 'unknown';
  
  // Chrome
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'blink';
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    name = 'firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'gecko';
  }
  // Safari
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'webkit';
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    name = 'edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'blink';
  }
  // Opera
  else if (userAgent.includes('OPR')) {
    name = 'opera';
    const match = userAgent.match(/OPR\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'blink';
  }
  // Samsung Internet
  else if (userAgent.includes('SamsungBrowser')) {
    name = 'samsung';
    const match = userAgent.match(/SamsungBrowser\/(\d+)/);
    version = match ? match[1] : '0';
    engine = 'blink';
  }
  
  const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const supported = checkBrowserSupport(name as keyof typeof SUPPORTED_BROWSERS, parseInt(version));
  
  return {
    name,
    version,
    engine,
    platform,
    mobile,
    supported,
  };
};

// Check if browser version is supported
const checkBrowserSupport = (browser: keyof typeof SUPPORTED_BROWSERS, version: number): boolean => {
  const minVersion = SUPPORTED_BROWSERS[browser];
  return minVersion ? version >= minVersion : false;
};

// Device detection utility
export const detectDevice = (): DeviceInfo => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  
  let type: DeviceInfo['type'] = 'desktop';
  if (width <= 768) {
    type = 'mobile';
  } else if (width <= 1024) {
    type = 'tablet';
  }
  
  const orientation = width > height ? 'landscape' : 'portrait';
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    type,
    orientation,
    screenSize: { width, height },
    pixelRatio,
    touchSupport,
  };
};

// Feature detection utility
export const detectFeatures = (): FeatureSupport => {
  return {
    localStorage: (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    
    sessionStorage: (() => {
      try {
        const test = 'test';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })(),
    
    canvas: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
      } catch {
        return false;
      }
    })(),
    
    svg: (() => {
      return !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
    })(),
    
    flexbox: (() => {
      const element = document.createElement('div');
      element.style.display = 'flex';
      return element.style.display === 'flex';
    })(),
    
    grid: (() => {
      const element = document.createElement('div');
      element.style.display = 'grid';
      return element.style.display === 'grid';
    })(),
    
    customProperties: (() => {
      return window.CSS && CSS.supports && CSS.supports('color', 'var(--test)');
    })(),
    
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    webWorkers: 'Worker' in window,
    serviceWorkers: 'serviceWorker' in navigator,
    pushNotifications: 'PushManager' in window,
    geolocation: 'geolocation' in navigator,
    
    camera: (() => {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    })(),
    
    microphone: (() => {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    })(),
  };
};

// Accessibility detection
export const detectAccessibilityFeatures = () => {
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    screenReader: (() => {
      // Basic screen reader detection
      return !!(
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        window.speechSynthesis
      );
    })(),
  };
};

// Performance capabilities detection
export const detectPerformanceCapabilities = () => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    memory: (performance as any).memory ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit,
    } : null,
    connection: connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    } : null,
  };
};

// Comprehensive compatibility check
export const runCompatibilityCheck = () => {
  const browser = detectBrowser();
  const device = detectDevice();
  const features = detectFeatures();
  const accessibility = detectAccessibilityFeatures();
  const performance = detectPerformanceCapabilities();
  
  const report = {
    browser,
    device,
    features,
    accessibility,
    performance,
    timestamp: new Date().toISOString(),
  };
  
  // Log compatibility information
  log.info('Compatibility check completed', report);
  
  // Check for critical issues
  const criticalIssues = [];
  
  if (!browser.supported) {
    criticalIssues.push(`Unsupported browser: ${browser.name} ${browser.version}`);
  }
  
  if (!features.localStorage) {
    criticalIssues.push('LocalStorage not supported');
  }
  
  if (!features.flexbox) {
    criticalIssues.push('Flexbox not supported');
  }
  
  if (criticalIssues.length > 0) {
    log.warn('Critical compatibility issues detected', criticalIssues);
  }
  
  return {
    ...report,
    criticalIssues,
    isCompatible: criticalIssues.length === 0,
  };
};

// Polyfill loader
export const loadPolyfills = async () => {
  const features = detectFeatures();
  const polyfillsNeeded = [];

  // Check which polyfills are needed
  if (!features.intersectionObserver) {
    polyfillsNeeded.push('IntersectionObserver');
  }

  if (!features.resizeObserver) {
    polyfillsNeeded.push('ResizeObserver');
  }

  if (!window.CSS || !CSS.supports) {
    polyfillsNeeded.push('CSS.supports');
  }

  if (polyfillsNeeded.length > 0) {
    log.info(`Polyfills needed: ${polyfillsNeeded.join(', ')}`);
    log.info('Consider adding polyfills via CDN or package installation');
  } else {
    log.info('No polyfills needed - all features supported');
  }
};

// Initialize compatibility checking
export const initializeCompatibility = () => {
  const report = runCompatibilityCheck();
  
  // Show warning for unsupported browsers
  if (!report.isCompatible) {
    console.warn('Browser compatibility issues detected:', report.criticalIssues);
    
    // You could show a user-friendly warning here
    if (typeof document !== 'undefined') {
      const warning = document.createElement('div');
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #f59e0b;
        color: white;
        padding: 10px;
        text-align: center;
        z-index: 10000;
        font-family: system-ui, sans-serif;
      `;
      warning.innerHTML = `
        <strong>Browser Compatibility Warning:</strong> 
        Some features may not work properly in your browser. 
        Please consider updating to a newer version.
      `;
      document.body.appendChild(warning);
    }
  }
  
  return report;
};

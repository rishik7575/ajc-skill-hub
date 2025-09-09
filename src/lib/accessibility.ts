// Accessibility utilities and WCAG 2.1 AA compliance helpers

import { log } from './logger';

// WCAG 2.1 AA compliance checker
export interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  recommendations: string[];
  wcagLevel: 'A' | 'AA' | 'AAA' | 'FAIL';
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  rule: string;
  description: string;
  element?: HTMLElement;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

// Color contrast utilities
export const checkColorContrast = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Check if contrast meets WCAG standards
export const meetsContrastRequirement = (contrast: number, level: 'AA' | 'AAA' = 'AA', isLargeText = false): boolean => {
  if (level === 'AAA') {
    return isLargeText ? contrast >= 4.5 : contrast >= 7;
  }
  return isLargeText ? contrast >= 3 : contrast >= 4.5;
};

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];
  
  static trapFocus(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    // Store cleanup function
    (container as any)._focusTrapCleanup = () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
  
  static releaseFocusTrap(container: HTMLElement): void {
    if ((container as any)._focusTrapCleanup) {
      (container as any)._focusTrapCleanup();
      delete (container as any)._focusTrapCleanup;
    }
  }
  
  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      this.focusStack.push(activeElement);
    }
  }
  
  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.focus) {
      element.focus();
    }
  }
}

// Screen reader utilities
export class ScreenReaderUtils {
  private static announcer: HTMLElement | null = null;
  
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) {
      this.announcer = document.createElement('div');
      this.announcer.setAttribute('aria-live', priority);
      this.announcer.setAttribute('aria-atomic', 'true');
      this.announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(this.announcer);
    }
    
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }
  
  static isScreenReaderActive(): boolean {
    // Basic detection - not 100% reliable
    return !!(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      (window as any).speechSynthesis
    );
  }
}

// Keyboard navigation utilities
export class KeyboardNavigation {
  static handleArrowKeys(
    container: HTMLElement,
    orientation: 'horizontal' | 'vertical' | 'both' = 'both'
  ): void {
    const focusableElements = Array.from(
      container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      if (currentIndex === -1) return;
      
      let nextIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % focusableElements.length;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % focusableElements.length;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
          }
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;
      }
      
      if (nextIndex !== currentIndex) {
        focusableElements[nextIndex].focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Store cleanup function
    (container as any)._keyboardNavCleanup = () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  static cleanup(container: HTMLElement): void {
    if ((container as any)._keyboardNavCleanup) {
      (container as any)._keyboardNavCleanup();
      delete (container as any)._keyboardNavCleanup;
    }
  }
}

// Accessibility audit
export const runAccessibilityAudit = (): AccessibilityReport => {
  const issues: AccessibilityIssue[] = [];
  let score = 100;
  
  // Check for missing alt text on images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push({
        type: 'error',
        rule: 'WCAG 1.1.1',
        description: 'Image missing alt text',
        element: img,
        severity: 'serious',
      });
      score -= 5;
    }
  });
  
  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 1.3.1',
        description: 'Heading hierarchy not logical',
        element: heading as HTMLElement,
        severity: 'moderate',
      });
      score -= 3;
    }
    lastLevel = level;
  });
  
  // Check for form labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`);
    
    if (!hasLabel) {
      issues.push({
        type: 'error',
        rule: 'WCAG 3.3.2',
        description: 'Form control missing label',
        element: input as HTMLElement,
        severity: 'serious',
      });
      score -= 5;
    }
  });
  
  // Check for sufficient color contrast
  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      // This is a simplified check - in practice, you'd need more sophisticated color parsing
      const contrast = checkColorContrast(color, backgroundColor);
      if (!meetsContrastRequirement(contrast)) {
        issues.push({
          type: 'warning',
          rule: 'WCAG 1.4.3',
          description: 'Insufficient color contrast',
          element: element as HTMLElement,
          severity: 'moderate',
        });
        score -= 2;
      }
    }
  });
  
  // Check for keyboard accessibility
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(element => {
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === '-1' && !element.getAttribute('aria-hidden')) {
      issues.push({
        type: 'warning',
        rule: 'WCAG 2.1.1',
        description: 'Interactive element not keyboard accessible',
        element: element as HTMLElement,
        severity: 'serious',
      });
      score -= 4;
    }
  });
  
  // Determine WCAG level
  let wcagLevel: AccessibilityReport['wcagLevel'] = 'FAIL';
  if (score >= 95) wcagLevel = 'AAA';
  else if (score >= 85) wcagLevel = 'AA';
  else if (score >= 70) wcagLevel = 'A';
  
  const recommendations = [
    'Add alt text to all images',
    'Ensure proper heading hierarchy',
    'Label all form controls',
    'Maintain sufficient color contrast',
    'Ensure keyboard accessibility',
    'Test with screen readers',
    'Validate HTML markup',
    'Use semantic HTML elements',
  ];
  
  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    wcagLevel,
  };
};

// Initialize accessibility features
export const initializeAccessibility = (): void => {
  // Set up global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Skip to main content (Alt + M)
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      const main = document.querySelector('main, [role="main"]') as HTMLElement;
      if (main) {
        main.focus();
        main.scrollIntoView();
      }
    }
    
    // Skip to navigation (Alt + N)
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      const nav = document.querySelector('nav, [role="navigation"]') as HTMLElement;
      if (nav) {
        const firstLink = nav.querySelector('a, button') as HTMLElement;
        if (firstLink) firstLink.focus();
      }
    }
  });
  
  // Add skip links if they don't exist
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Run initial accessibility audit
  const report = runAccessibilityAudit();
  log.info('Accessibility audit completed', {
    score: report.score,
    wcagLevel: report.wcagLevel,
    issueCount: report.issues.length,
  });
  
  if (report.issues.length > 0) {
    log.warn('Accessibility issues detected', report.issues);
  }
};

// Comprehensive integration testing utilities

import { log } from './logger';

// Test result interfaces
export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
  details?: unknown;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
}

// Test runner class
export class IntegrationTester {
  private results: TestSuite[] = [];
  
  async runAllTests(): Promise<TestSuite[]> {
    log.info('Starting comprehensive integration testing');
    
    const suites = [
      this.testUserFlows(),
      this.testNavigation(),
      this.testForms(),
      this.testCourseDetails(),
      this.testAuthentication(),
      this.testResponsiveDesign(),
      this.testPerformance(),
      this.testAccessibility(),
    ];
    
    this.results = await Promise.all(suites);
    
    const summary = this.generateSummary();
    log.info('Integration testing completed', summary);
    
    return this.results;
  }
  
  private async runTestSuite(name: string, tests: (() => Promise<TestResult>)[]): Promise<TestSuite> {
    const startTime = performance.now();
    const results: TestResult[] = [];
    
    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
      } catch (error) {
        results.push({
          name: 'Unknown Test',
          status: 'fail',
          duration: 0,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    
    const endTime = performance.now();
    
    return {
      name,
      tests: results,
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      skippedTests: results.filter(r => r.status === 'skip').length,
      duration: endTime - startTime,
    };
  }
  
  private async testUserFlows(): Promise<TestSuite> {
    return this.runTestSuite('User Flows', [
      async () => this.testLandingPageLoad(),
      async () => this.testCourseSelection(),
      async () => this.testUserRegistration(),
      async () => this.testUserLogin(),
      async () => this.testCourseEnrollment(),
      async () => this.testProgressTracking(),
    ]);
  }
  
  private async testNavigation(): Promise<TestSuite> {
    return this.runTestSuite('Navigation', [
      async () => this.testMainNavigation(),
      async () => this.testBreadcrumbs(),
      async () => this.testBackButton(),
      async () => this.testDeepLinking(),
      async () => this.testMobileNavigation(),
    ]);
  }
  
  private async testForms(): Promise<TestSuite> {
    return this.runTestSuite('Forms', [
      async () => this.testLoginForm(),
      async () => this.testSignupForm(),
      async () => this.testFeedbackForm(),
      async () => this.testFormValidation(),
      async () => this.testFormSubmission(),
    ]);
  }
  
  private async testCourseDetails(): Promise<TestSuite> {
    return this.runTestSuite('Course Details', [
      async () => this.testCourseDataLoading(),
      async () => this.testCourseInformation(),
      async () => this.testCourseReviews(),
      async () => this.testCourseEnrollmentButton(),
    ]);
  }
  
  private async testAuthentication(): Promise<TestSuite> {
    return this.runTestSuite('Authentication', [
      async () => this.testLoginProcess(),
      async () => this.testLogoutProcess(),
      async () => this.testSessionPersistence(),
      async () => this.testProtectedRoutes(),
    ]);
  }
  
  private async testResponsiveDesign(): Promise<TestSuite> {
    return this.runTestSuite('Responsive Design', [
      async () => this.testMobileLayout(),
      async () => this.testTabletLayout(),
      async () => this.testDesktopLayout(),
      async () => this.testOrientationChange(),
    ]);
  }
  
  private async testPerformance(): Promise<TestSuite> {
    return this.runTestSuite('Performance', [
      async () => this.testPageLoadTime(),
      async () => this.testBundleSize(),
      async () => this.testMemoryUsage(),
      async () => this.testRenderTime(),
    ]);
  }
  
  private async testAccessibility(): Promise<TestSuite> {
    return this.runTestSuite('Accessibility', [
      async () => this.testKeyboardNavigation(),
      async () => this.testScreenReaderSupport(),
      async () => this.testColorContrast(),
      async () => this.testFocusManagement(),
    ]);
  }
  
  // Individual test implementations
  private async testLandingPageLoad(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      // Check if landing page elements are present
      const heroSection = document.querySelector('[data-testid="hero-section"]') || 
                         document.querySelector('.hero') ||
                         document.querySelector('h1');
      
      const coursesSection = document.querySelector('[data-testid="courses-section"]') ||
                           document.querySelector('.courses') ||
                           document.querySelectorAll('.card').length > 0;
      
      if (!heroSection) {
        throw new Error('Hero section not found');
      }
      
      if (!coursesSection) {
        throw new Error('Courses section not found');
      }
      
      return {
        name: 'Landing Page Load',
        status: 'pass',
        duration: performance.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'Landing Page Load',
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  private async testCourseSelection(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const courseCards = document.querySelectorAll('[data-testid="course-card"]') ||
                         document.querySelectorAll('.card');
      
      if (courseCards.length === 0) {
        throw new Error('No course cards found');
      }
      
      // Test if course cards are clickable
      const firstCard = courseCards[0] as HTMLElement;
      const viewDetailsButton = firstCard.querySelector('button') || 
                               firstCard.querySelector('a');
      
      if (!viewDetailsButton) {
        throw new Error('Course card not interactive');
      }
      
      return {
        name: 'Course Selection',
        status: 'pass',
        duration: performance.now() - startTime,
        details: { courseCount: courseCards.length },
      };
    } catch (error) {
      return {
        name: 'Course Selection',
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  private async testMainNavigation(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const nav = document.querySelector('nav') || 
                 document.querySelector('[role="navigation"]');
      
      if (!nav) {
        throw new Error('Navigation not found');
      }
      
      const navLinks = nav.querySelectorAll('a, button');
      if (navLinks.length === 0) {
        throw new Error('No navigation links found');
      }
      
      return {
        name: 'Main Navigation',
        status: 'pass',
        duration: performance.now() - startTime,
        details: { linkCount: navLinks.length },
      };
    } catch (error) {
      return {
        name: 'Main Navigation',
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  private async testFormValidation(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const forms = document.querySelectorAll('form');
      if (forms.length === 0) {
        return {
          name: 'Form Validation',
          status: 'skip',
          duration: performance.now() - startTime,
          details: 'No forms found on current page',
        };
      }
      
      // Check if forms have proper validation attributes
      let hasValidation = false;
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (input.hasAttribute('required') || 
              input.hasAttribute('pattern') ||
              input.hasAttribute('minlength') ||
              input.hasAttribute('maxlength')) {
            hasValidation = true;
          }
        });
      });
      
      return {
        name: 'Form Validation',
        status: hasValidation ? 'pass' : 'fail',
        duration: performance.now() - startTime,
        error: hasValidation ? undefined : 'Forms lack validation attributes',
      };
    } catch (error) {
      return {
        name: 'Form Validation',
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  private async testKeyboardNavigation(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        throw new Error('No focusable elements found');
      }
      
      // Check if elements have proper focus indicators
      let hasFocusStyles = false;
      const testElement = focusableElements[0] as HTMLElement;
      testElement.focus();
      
      const styles = window.getComputedStyle(testElement, ':focus');
      if (styles.outline !== 'none' || styles.boxShadow !== 'none') {
        hasFocusStyles = true;
      }
      
      return {
        name: 'Keyboard Navigation',
        status: hasFocusStyles ? 'pass' : 'fail',
        duration: performance.now() - startTime,
        details: { focusableCount: focusableElements.length },
        error: hasFocusStyles ? undefined : 'Focus indicators not visible',
      };
    } catch (error) {
      return {
        name: 'Keyboard Navigation',
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  private async testPageLoadTime(): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      const isAcceptable = loadTime < 3000; // 3 seconds threshold
      
      return {
        name: 'Page Load Time',
        status: isAcceptable ? 'pass' : 'fail',
        duration: performance.now() - startTime,
        details: { loadTime: `${loadTime.toFixed(2)}ms` },
        error: isAcceptable ? undefined : `Page load time too slow: ${loadTime.toFixed(2)}ms`,
      };
    } catch (error) {
      return {
        name: 'Page Load Time',
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  
  private generateSummary() {
    const totalSuites = this.results.length;
    const totalTests = this.results.reduce((sum, suite) => sum + suite.totalTests, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passedTests, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failedTests, 0);
    const totalSkipped = this.results.reduce((sum, suite) => sum + suite.skippedTests, 0);
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0);
    
    return {
      totalSuites,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
      passRate: `${((totalPassed / totalTests) * 100).toFixed(1)}%`,
    };
  }
  
  getResults(): TestSuite[] {
    return this.results;
  }
  
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      results: this.results,
    }, null, 2);
  }
}

// Convenience function to run tests
export const runIntegrationTests = async (): Promise<TestSuite[]> => {
  const tester = new IntegrationTester();
  return await tester.runAllTests();
};

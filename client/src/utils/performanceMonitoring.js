/**
 * Performance monitoring and metrics collection
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.marks = new Map();
  }

  /**
   * Measure execution time of a function
   */
  async measure(label, asyncFunc) {
    const startMark = `${label}-start`;
    const endMark = `${label}-end`;

    performance.mark(startMark);

    try {
      const result = await asyncFunc();
      performance.mark(endMark);
      performance.measure(label, startMark, endMark);

      const measure = performance.getEntriesByName(label)[0];
      const duration = measure ? measure.duration : 0;
      
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.metrics.set(label, duration);
      
      return result;
    } catch (error) {
      console.error(`❌ ${label} failed:`, error);
      throw error;
    } finally {
      // Cleanup
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(label);
    }
  }

  /**
   * Get Core Web Vitals
   */
  async getCoreWebVitals() {
    return new Promise((resolve) => {
      const vitals = {
        fcp: null, // First Contentful Paint
        lcp: null, // Largest Contentful Paint
        tti: null, // Time to Interactive
        cls: null  // Cumulative Layout Shift
      };

      // Observe FCP and LCP
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.lcp = entry.renderTime || entry.loadTime;
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported');
      }

      // Get navigation timing for TTI (approximation)
      if (performance.getEntriesByType) {
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
          vitals.tti = navTiming.domInteractive;
        }
      }

      setTimeout(() => {
        observer.disconnect();
        console.log('📊 Core Web Vitals:', vitals);
        resolve(vitals);
      }, 5000);
    });
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      };
    }
    return null;
  }

  /**
   * Report metrics to console
   */
  reportMetrics() {
    console.group('📈 Performance Metrics');
    this.metrics.forEach((duration, label) => {
      console.log(`${label}: ${duration.toFixed(2)}ms`);
    });
    console.groupEnd();

    const memory = this.getMemoryUsage();
    if (memory) {
      console.group('💾 Memory Usage');
      console.log(memory);
      console.groupEnd();
    }
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Long Task detection (if supported)
 */
export function monitorLongTasks() {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn('🐢 Long Task detected:', {
            duration: entry.duration.toFixed(2) + 'ms',
            startTime: entry.startTime.toFixed(2) + 'ms',
            attribution: entry.attribution
          });
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
      return observer;
    } catch (e) {
      console.log('Long Task detection not available');
    }
  }
}

/**
 * Network information monitoring
 */
export function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType, // 4g, 3g, 2g, slow-2g
      downlink: connection.downlink + ' Mbps',
      rtt: connection.rtt + 'ms',
      saveData: connection.saveData
    };
  }
  return null;
}

/**
 * Adaptive loading based on network
 */
export function shouldReduceQuality() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;

  return connection.effectiveType === '2g' || 
         connection.effectiveType === '3g' ||
         connection.effectiveType === 'slow-2g' ||
         connection.saveData;
}

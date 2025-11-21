/**
 * Performance Monitoring Service
 * Tracks Web Vitals and transaction performance
 * Helps identify bottlenecks and optimize UX
 */

const performanceData = {};

export const performanceMonitor = {
  /**
   * Measure Core Web Vitals (LCP, FID, CLS)
   * @param {function} onReport - Callback when metric is recorded
   */
  measureWebVitals: (onReport) => {
    try {
      // Largest Contentful Paint (LCP) - when largest content is visible
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcpValue = lastEntry.renderTime || lastEntry.loadTime;
            
            performanceData.lcp = lcpValue;
            console.log(`[performanceMonitor] LCP: ${lcpValue}ms`);
            onReport?.({ metric: 'LCP', value: lcpValue, unit: 'ms' });
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
        } catch (error) {
          console.warn('[performanceMonitor] LCP observer error:', error);
        }

        // First Input Delay (FID) - responsiveness to user input
        try {
          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              performanceData.fid = entry.processingDuration;
              console.log(`[performanceMonitor] FID: ${entry.processingDuration}ms`);
              onReport?.({ metric: 'FID', value: entry.processingDuration, unit: 'ms' });
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'], buffered: true });
        } catch (error) {
          console.warn('[performanceMonitor] FID observer error:', error);
        }

        // Cumulative Layout Shift (CLS) - visual stability
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                performanceData.cls = clsValue;
                console.log(`[performanceMonitor] CLS: ${clsValue.toFixed(3)}`);
                onReport?.({ metric: 'CLS', value: parseFloat(clsValue.toFixed(3)), unit: 'score' });
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'], buffered: true });
        } catch (error) {
          console.warn('[performanceMonitor] CLS observer error:', error);
        }
      }
    } catch (error) {
      console.error('[performanceMonitor] Web Vitals measurement error:', error);
    }
  },

  /**
   * Measure transaction confirmation time
   * @param {string} txHash - Transaction hash
   * @param {number} startTime - Start timestamp
   * @param {number} endTime - End timestamp
   */
  measureTransactionTime: (txHash, startTime, endTime) => {
    try {
      const duration = endTime - startTime;
      performanceData[`tx_${txHash}`] = duration;
      
      console.log(`[performanceMonitor] Transaction ${txHash} confirmed in ${duration}ms`);
      return duration;
    } catch (error) {
      console.error('[performanceMonitor] Transaction time measurement error:', error);
      return 0;
    }
  },

  /**
   * Measure page load time
   */
  measurePageLoad: () => {
    try {
      if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        performanceData.pageLoadTime = pageLoadTime;
        performanceData.connectTime = connectTime;
        performanceData.renderTime = renderTime;
        
        console.log(`[performanceMonitor] Page Load Time: ${pageLoadTime}ms`);
        console.log(`[performanceMonitor] Connect Time: ${connectTime}ms`);
        console.log(`[performanceMonitor] Render Time: ${renderTime}ms`);
        
        return {
          pageLoadTime,
          connectTime,
          renderTime
        };
      }
    } catch (error) {
      console.error('[performanceMonitor] Page load measurement error:', error);
    }
  },

  /**
   * Measure API call duration
   * @param {string} apiName - Name of the API call
   * @param {function} apiCall - The async API call function
   */
  measureApiCall: async (apiName, apiCall) => {
    try {
      const startTime = performance.now();
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performanceData[`api_${apiName}`] = duration;
      console.log(`[performanceMonitor] API "${apiName}" took ${duration.toFixed(2)}ms`);
      
      return { result, duration };
    } catch (error) {
      console.error(`[performanceMonitor] API call error for "${apiName}":`, error);
      throw error;
    }
  },

  /**
   * Measure component render time (React)
   * @param {string} componentName - Name of the component
   * @param {function} renderFn - The render function
   */
  measureComponentRender: (componentName, renderFn) => {
    try {
      const startTime = performance.now();
      const result = renderFn();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performanceData[`component_${componentName}`] = duration;
      
      if (duration > 50) {
        console.warn(`[performanceMonitor] Slow component render: "${componentName}" took ${duration.toFixed(2)}ms`);
      } else {
        console.log(`[performanceMonitor] Component "${componentName}" rendered in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      console.error(`[performanceMonitor] Component render error for "${componentName}":`, error);
      throw error;
    }
  },

  /**
   * Get all recorded performance metrics
   */
  getMetrics: () => {
    return { ...performanceData };
  },

  /**
   * Get specific metric by name
   * @param {string} metricName - Name of the metric
   */
  getMetric: (metricName) => {
    return performanceData[metricName] || null;
  },

  /**
   * Calculate average metric value
   * @param {string} pattern - Pattern to match metric names (e.g., "api_*")
   */
  getAverageMetric: (pattern) => {
    try {
      const regex = new RegExp(pattern.replace('*', '.*'));
      const matchingMetrics = Object.entries(performanceData)
        .filter(([key]) => regex.test(key))
        .map(([, value]) => value);
      
      if (matchingMetrics.length === 0) return null;
      
      const sum = matchingMetrics.reduce((a, b) => a + b, 0);
      return sum / matchingMetrics.length;
    } catch (error) {
      console.error('[performanceMonitor] Average metric calculation error:', error);
      return null;
    }
  },

  /**
   * Log all metrics to console
   */
  logAllMetrics: () => {
    console.group('[performanceMonitor] All Metrics');
    Object.entries(performanceData).forEach(([key, value]) => {
      console.log(`${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`);
    });
    console.groupEnd();
  },

  /**
   * Clear all recorded metrics
   */
  clearMetrics: () => {
    Object.keys(performanceData).forEach(key => delete performanceData[key]);
    console.log('[performanceMonitor] Cleared all metrics');
  },

  /**
   * Export metrics as JSON
   */
  exportMetrics: () => {
    return JSON.stringify(performanceData, null, 2);
  },

  /**
   * Check if Core Web Vitals are good
   * @returns {object} Assessment of Core Web Vitals
   */
  assessWebVitals: () => {
    return {
      lcp: {
        value: performanceData.lcp,
        good: performanceData.lcp <= 2500,
        status: performanceData.lcp <= 2500 ? '✅ Good' : '⚠️ Needs improvement'
      },
      fid: {
        value: performanceData.fid,
        good: performanceData.fid <= 100,
        status: performanceData.fid <= 100 ? '✅ Good' : '⚠️ Needs improvement'
      },
      cls: {
        value: performanceData.cls,
        good: performanceData.cls <= 0.1,
        status: performanceData.cls <= 0.1 ? '✅ Good' : '⚠️ Needs improvement'
      }
    };
  }
};

export default performanceMonitor;

/**
 * Image optimization utilities
 * Responsive images with WebP fallback
 */

export function getImageSrcSet(imageName, sizes = [150, 300, 600]) {
  const srcset = sizes
    .map(size => `/images/${imageName}-${size}w.webp ${size}w`)
    .join(', ');
  
  return {
    srcSet: srcset,
    fallback: `/images/${imageName}.png`
  };
}

export function optimizeImage(src, alt, className = '') {
  return {
    src: src,
    alt: alt,
    className: className,
    loading: 'lazy',
    decoding: 'async'
  };
}

/**
 * Prefetch utilities for intelligent resource loading
 */
export class Prefetcher {
  constructor() {
    this.prefetchedUrls = new Set();
  }

  prefetchImage(url) {
    if (this.prefetchedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
    this.prefetchedUrls.add(url);
  }

  prefetchScript(url) {
    if (this.prefetchedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = url;
    document.head.appendChild(link);
    this.prefetchedUrls.add(url);
  }

  prefetchStyle(url) {
    if (this.prefetchedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'style';
    link.href = url;
    document.head.appendChild(link);
    this.prefetchedUrls.add(url);
  }

  // Preload critical resources (loads immediately)
  preloadCritical(url, as = 'script') {
    if (this.prefetchedUrls.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
    this.prefetchedUrls.add(url);
  }

  // DNS prefetch for external domains
  dnsPrefetch(domain) {
    if (this.prefetchedUrls.has(domain)) return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
    this.prefetchedUrls.add(domain);
  }
}

export const prefetcher = new Prefetcher();

/**
 * Prefetch components likely to be used
 */
export function prefetchCommonResources() {
  // Prefetch likely-needed API endpoints
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // These will be fetched when browser is idle
      prefetcher.dnsPrefetch('http://localhost:4001'); // BlockDAG
      prefetcher.dnsPrefetch('http://localhost:4002'); // Mock API
    });
  }
}

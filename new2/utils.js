/**
 * Enhanced WebBuilder Pro - Utility Functions
 * Modern ES6+ utility functions for the enhanced website builder
 */

// ===== CONSTANTS =====
const STORAGE_KEYS = {
  THEME: 'webbuilder-theme',
  PROJECT: 'webbuilder-project',
  CUSTOM_BLOCKS: 'webbuilder-custom-blocks',
  SETTINGS: 'webbuilder-settings',
  CLIPBOARD: 'webbuilder-clipboard'
};

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

const DEVICE_BREAKPOINTS = {
  MOBILE: 575,
  TABLET: 992,
  DESKTOP: Infinity
};

// ===== UTILITY CLASSES =====

/**
 * Local Storage Manager with error handling and type safety
 */
class StorageManager {
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage', error);
      return false;
    }
  }
}

/**
 * Theme Manager for handling light/dark theme switching
 */
class ThemeManager {
  constructor() {
    this.currentTheme = StorageManager.get(STORAGE_KEYS.THEME, THEMES.DARK);
    this.observers = new Set();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (theme === THEMES.LIGHT) {
      body.classList.add('light-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      }
    } else {
      body.classList.remove('light-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      }
    }
    
    this.currentTheme = theme;
    StorageManager.set(STORAGE_KEYS.THEME, theme);
    this.notifyObservers(theme);
  }

  toggle() {
    const newTheme = this.currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    this.applyTheme(newTheme);
  }

  setupSystemThemeListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!StorageManager.get(STORAGE_KEYS.THEME)) {
          this.applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        }
      });
    }
  }

  subscribe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notifyObservers(theme) {
    this.observers.forEach(callback => callback(theme));
  }
}

/**
 * Event Bus for decoupled component communication
 */
class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  clear() {
    this.events.clear();
  }
}

/**
 * Debounce utility for performance optimization
 */
const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

/**
 * Throttle utility for performance optimization
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone utility
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Generate unique ID
 */
const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email address
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get device type based on screen width
 */
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width <= DEVICE_BREAKPOINTS.MOBILE) return 'mobile';
  if (width <= DEVICE_BREAKPOINTS.TABLET) return 'tablet';
  return 'desktop';
};

/**
 * Copy text to clipboard
 */
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download data as file
 */
const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Load image with promise
 */
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Wait for element to be available in DOM
 */
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

/**
 * Animate element with CSS classes
 */
const animateElement = (element, animationClass, duration = 300) => {
  return new Promise((resolve) => {
    const handleAnimationEnd = () => {
      element.classList.remove(animationClass);
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };

    element.addEventListener('animationend', handleAnimationEnd);
    element.classList.add(animationClass);

    // Fallback timeout in case animationend doesn't fire
    setTimeout(() => {
      element.classList.remove(animationClass);
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    }, duration + 100);
  });
};

/**
 * Show toast notification
 */
const showToast = (message, type = 'info', duration = 3000) => {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: var(--color-bg-panel);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-toast);
    transform: translateX(100%);
    transition: transform var(--transition-normal);
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  // Remove after duration
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
};

/**
 * Performance monitoring utilities
 */
const performance = {
  mark: (name) => {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  },

  measure: (name, startMark, endMark) => {
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        return measure ? measure.duration : 0;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  }
};

// ===== EXPORTS =====
// Create global utilities object
window.WebBuilderUtils = {
  StorageManager,
  ThemeManager,
  EventBus,
  debounce,
  throttle,
  deepClone,
  generateId,
  formatFileSize,
  isValidEmail,
  isValidUrl,
  getDeviceType,
  copyToClipboard,
  downloadFile,
  loadImage,
  waitForElement,
  animateElement,
  showToast,
  performance,
  STORAGE_KEYS,
  THEMES,
  DEVICE_BREAKPOINTS
};

// Initialize global instances
window.WebBuilderUtils.eventBus = new EventBus();
window.WebBuilderUtils.themeManager = new ThemeManager();


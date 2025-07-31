/**
 * Enhanced WebBuilder Pro - Service Worker
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'webbuilder-pro-v2.0.0';
const STATIC_CACHE_NAME = 'webbuilder-static-v2.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/context-menu.css',
  '/reset.css',
  '/script.js',
  '/utils.js',
  '/blocks.js',
  '/commands.js',
  // External CDN resources (will be cached when accessed)
  'https://unpkg.com/grapesjs/dist/css/grapes.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://unpkg.com/grapesjs',
  'https://unpkg.com/grapesjs-preset-webpage',
  'https://unpkg.com/grapesjs-blocks-basic',
  'https://unpkg.com/grapesjs-plugin-forms',
  'https://unpkg.com/grapesjs-plugin-export'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES.filter(url => !url.startsWith('http')));
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  return pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.html') ||
         pathname === '/' ||
         url.hostname === 'unpkg.com' ||
         url.hostname === 'cdnjs.cloudflare.com';
}

// Check if request is for an API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  return pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.gif') ||
         pathname.endsWith('.webp') ||
         pathname.endsWith('.svg') ||
         url.hostname === 'via.placeholder.com';
}

// Handle static asset requests (cache first strategy)
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache', request.url);
      return cachedResponse;
    }
    
    console.log('Service Worker: Fetching and caching', request.url);
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Service Worker: Failed to fetch static asset', error);
    
    // Return offline fallback for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WebBuilder Pro - Offline</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              background: #f5f5f5;
              color: #333;
            }
            .offline-message {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .offline-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <div class="offline-icon">📱</div>
            <h1>You're Offline</h1>
            <p>WebBuilder Pro is not available right now. Please check your internet connection.</p>
            <button onclick="location.reload()">Try Again</button>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

// Handle API requests (network first strategy)
async function handleAPIRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: API request failed, trying cache', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response for API requests
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      message: 'This feature requires an internet connection'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle image requests (cache first with fallback)
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Image request failed', request.url);
    
    // Return placeholder image
    return new Response(
      `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#f0f0f0"/>
        <text x="150" y="100" text-anchor="middle" fill="#999" font-family="Arial, sans-serif" font-size="14">
          Image Unavailable
        </text>
      </svg>`,
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

// Handle generic requests (network first strategy)
async function handleGenericRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('Service Worker: Generic request failed, trying cache', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for saving projects when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'save-project') {
    event.waitUntil(syncProject());
  }
});

async function syncProject() {
  try {
    // Get pending project data from IndexedDB or localStorage
    const pendingProject = await getStoredData('pending-project');
    
    if (pendingProject) {
      // Try to sync with server (if you have a backend)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingProject)
      });
      
      if (response.ok) {
        // Clear pending data on successful sync
        await clearStoredData('pending-project');
        console.log('Service Worker: Project synced successfully');
      }
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync project', error);
  }
}

// Helper functions for data storage
async function getStoredData(key) {
  // This would typically use IndexedDB for more complex data
  return JSON.parse(localStorage.getItem(key) || 'null');
}

async function clearStoredData(key) {
  localStorage.removeItem(key);
}

// Handle push notifications (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: 'webbuilder-notification',
        actions: [
          {
            action: 'open',
            title: 'Open WebBuilder Pro'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Log service worker lifecycle
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Script loaded');


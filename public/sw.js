// Service Worker for Push Notifications
const CACHE_NAME = 'chipindo-portal-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/favicon.ico',
          '/icons/info.png',
          '/icons/warning.png',
          '/icons/error.png',
          '/icons/success.png',
          '/icons/urgent.png'
        ]);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Push event
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'Nova Notificação',
    body: 'Você tem uma nova notificação',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'default',
    data: {},
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  const notificationPromise = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.tag === 'urgent',
      silent: false,
      vibrate: notificationData.tag === 'urgent' ? [200, 100, 200] : [100],
      sound: notificationData.tag === 'urgent' ? '/sounds/urgent.mp3' : undefined
    }
  );

  event.waitUntil(notificationPromise);
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification close event
  if (event.notification.data?.tracking) {
    // Send analytics data
    fetch('/api/notification-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'close',
        notificationId: event.notification.data?.id,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      console.error('Error tracking notification close:', error);
    });
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(
      syncNotifications()
    );
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic background sync:', event);
  
  if (event.tag === 'notification-check') {
    event.waitUntil(
      checkForNewNotifications()
    );
  }
});

// Message event
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Helper functions
async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const notifications = await response.json();
      
      for (const notification of notifications) {
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          badge: notification.badge,
          tag: notification.tag,
          data: notification.data,
          requireInteraction: notification.priority === 'high',
          silent: false
        });
      }
    }
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}

async function checkForNewNotifications() {
  try {
    const response = await fetch('/api/notifications/check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const { hasNewNotifications } = await response.json();
      
      if (hasNewNotifications) {
        // Show a generic notification to check for updates
        await self.registration.showNotification('Novas Notificações', {
          body: 'Você tem novas notificações. Clique para ver.',
          icon: '/favicon.ico',
          tag: 'new-notifications',
          data: { url: '/admin/notifications' },
          requireInteraction: false,
          silent: false
        });
      }
    }
  } catch (error) {
    console.error('Error checking for new notifications:', error);
  }
}

// Cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return fetchResponse;
            });
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }
});

console.log('Service Worker loaded successfully'); 
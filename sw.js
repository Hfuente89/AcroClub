const CACHE_NAME = 'acroyoga-v1'
const urlsToCache = [
  '/',
  '/index.html',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }).then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
    .catch(() => {
      // Return a fallback response
      return caches.match('/')
    })
  )
})

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push notification received but no data')
    return
  }

  try {
    const data = event.data.json()
    const options = {
      body: data.body || 'Nuevo taller disponible',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23ec4899" width="192" height="192"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" fill="white" font-family="system-ui">🤸</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="white" font-family="system-ui">🤸</text></svg>',
      tag: 'new-workshop',
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'Ver' },
        { action: 'close', title: 'Descartar' }
      ]
    }

    event.waitUntil(
      self.registration.showNotification('Acroyoga Club - ' + (data.title || 'Nuevo taller'), options)
    )
  } catch (error) {
    console.error('Error parsing push notification:', error)
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if already open
      for (let client of clientList) {
        if (client.url === '/' || client.url.includes('/AcroClub')) {
          return client.focus()
        }
      }
      // Open new window if not already open
      if (clients.openWindow) {
        return clients.openWindow('/AcroClub/')
      }
    })
  )
})


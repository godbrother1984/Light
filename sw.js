/*
  path: /sw.js (ในระดับ root ของ website)
  version: 1.0 (Service Worker for Performance Optimization)
  date: 2025-09-04
  time: 17:05:00
  description: Service Worker สำหรับ cache static files และปรับปรุง performance
*/

const CACHE_NAME = 'light-measurement-v1.0';
const STATIC_CACHE_URLS = [
    // CSS Files
    'ui/assets/css/main-styles.css',
    'ui/assets/css/sidebar.css',
    'ui/assets/css/components.css',
    
    // JavaScript Files
    'ui/assets/js/firebase-init.js',
    'ui/assets/js/ui-helpers.js',
    'ui/assets/js/pdf-generator.js',
    'ui/tag-processor.js',
    
    // HTML Pages
    'ui/main.html',
    'ui/new-job.html',
    'ui/job-details.html',
    'ui/report-finalizer.html',
    'ui/template-manager.html',
    'ui/master-data-manager.html',
    
    // External Libraries (cache บาง libraries สำคัญ)
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_CACHE_URLS.map(url => {
                    return new Request(url, { mode: 'cors' });
                }));
            })
            .catch((error) => {
                console.log('Cache installation failed:', error);
            })
    );
    
    // บังคับให้ Service Worker ใหม่เข้าควบคุมทันที
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ลบ cache เก่าที่ไม่ใช้แล้ว
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // ให้ Service Worker ควบคุม clients ทั้งหมดทันที
            return self.clients.claim();
        })
    );
});

// Fetch Event - Intercept network requests
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    
    // ข้ามการ cache สำหรับ Firebase requests และ API calls
    if (requestUrl.hostname.includes('firebase') || 
        requestUrl.hostname.includes('googleapis') ||
        event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // ถ้ามี cache ให้ส่ง cache กลับไป
                if (cachedResponse) {
                    console.log('Serving from cache:', event.request.url);
                    return cachedResponse;
                }
                
                // ถ้าไม่มี cache ให้ fetch จาก network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // ถ้า response ไม่ OK หรือไม่ใช่ basic response ไม่ต้อง cache
                        if (!networkResponse || 
                            networkResponse.status !== 200 || 
                            networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone response เพื่อ cache (เพราะ response stream ใช้ได้ครั้งเดียว)
                        const responseToCache = networkResponse.clone();
                        
                        // Cache response สำหรับครั้งถัดไป
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Cache เฉพาะ static files
                                if (event.request.url.includes('.css') ||
                                    event.request.url.includes('.js') ||
                                    event.request.url.includes('.html') ||
                                    event.request.url.includes('fonts.googleapis.com') ||
                                    event.request.url.includes('cdnjs.cloudflare.com')) {
                                    cache.put(event.request, responseToCache);
                                    console.log('Cached:', event.request.url);
                                }
                            });
                        
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.log('Network request failed:', error);
                        
                        // ถ้าเป็น HTML request และ network ไม่ได้ ให้ส่ง offline page
                        if (event.request.destination === 'document') {
                            return caches.match('ui/main.html');
                        }
                        
                        // สำหรับ resources อื่นๆ
                        throw error;
                    });
            })
    );
});

// Background Sync (ถ้าต้องการ sync ข้อมูลเมื่อ online กลับมา)
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // ทำ background sync tasks ที่นี่
            console.log('Performing background sync...')
        );
    }
});

// Push Notifications (ถ้าต้องการ notifications)
self.addEventListener('push', (event) => {
    console.log('Push message received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'มีข้อมูลใหม่',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'ดูรายละเอียด',
                icon: '/icon-check.png'
            },
            {
                action: 'close',
                title: 'ปิด',
                icon: '/icon-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Light Measurement System', options)
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // เปิดแอป
        event.waitUntil(
            clients.openWindow('ui/main.html')
        );
    }
});

// Message from main thread
self.addEventListener('message', (event) => {
    console.log('Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // ส่ง response กลับ
    event.ports[0].postMessage({
        type: 'RESPONSE',
        message: 'Service Worker received message'
    });
});

console.log('Service Worker loaded successfully');
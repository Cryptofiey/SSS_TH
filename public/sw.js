// Service Worker for Siam Assist Push Notifications
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  let data = {
    title: 'Upcoming Consultation ⚖️',
    body: 'You have an upcoming consultation with your visa specialist.'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Upcoming Consultation ⚖️',
        body: event.data.text()
      };
    }
  }

  const options = {
    body: data.body,
    icon: 'https://img.icons8.com/color/96/scale.png', // A beautiful balance scale icon
    badge: 'https://img.icons8.com/color/96/scale.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      { action: 'open_url', title: 'Open Portal' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // If a window is already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

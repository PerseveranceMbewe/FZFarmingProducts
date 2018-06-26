 // register servicver worker 
 const staticCacheNames = 'currency-converter-static-v6'
 const urlsToCache = [
     staticCacheNames
 ]
 if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js').then(function (registration) {
         // Serviceworker registratuin successfull 
         console.log('Service Worker Registered', registration.scope)
     }, function (error) {
         // service worker registration unsuccseful 
         console.log('Service worker Regsitration Failed', error)
     })
 }

 self.addEventListener('install', function (event) {
     event.waitUntil(
         caches.open(staticCacheNames).then(function (cache) {
             // add all caches here 
             console.log('about to add all the caches to the server')
             return cache.addAll([
                 '/',
                 '/index.html',
                 'css/main.css',
                 'js/main.js',
                 'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
                 'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
             ]);
         }));
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('currency-') &&
                   !urlsToCache.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });


  self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
  
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('/index.html'));
        return;
      }
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });

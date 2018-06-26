 // register servicver worker 
 const staticCacheNames = 'currency-converter-static-v5'
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
             return cache.addAll([
                 '/',
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

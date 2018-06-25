 // register servicver worker 
 const staticCacheNames = 'currency-converter-static -v1'
 const urlsToCache = [
      // urls to cache
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


 self.addEventListener('install',function(event){
      event.waitUntil(caches.open(staticCacheNames).then(function(cache){
           // add all caches here 
           return cache.addAll([
               '/skeleton',
               'css/main.css',
               'js/main.js'
            ]);
      }))
 })
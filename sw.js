 // register servicver worker 
 const statticCacheNames = 'currency-converter-static -v1'
 const allCaches = [
      // add all out caches in the array 
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
      // installations here 
 })
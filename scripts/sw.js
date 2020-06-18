
self.addEventListener('install', function(event) {
	// Precache files
});

// => Es para crear la funtion de controlador
self.addEventListener('install', event => {});

const cacheName = 'static-shell-v1';
const resourcesToPrecache = [
	'/'.
	'index.html',
	'styles/main.css',
	'images/logo.jpg',
	'image/menu.jpg',
];

self.addEventListener('install', function(event) {
	console.log('Service worker install event!');
	event.waitUntil(
		caches.open(cacheName)
		  .then(function(cache) {
		    return cache.addAll(resourcesToPrecache);
		})
	);
});

// Podemos deshacernos de los cachés no utilizados en el evento "activar" del trabajador de servicio.
self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request) ||
				fetch(event.request)
	);
});

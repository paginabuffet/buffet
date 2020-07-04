/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';


// CODELAB: Update cache names any time any of the cached files change.

const CACHE_NAME = 'static-cache-version1';
const DATA_CACHE_NAME = 'data-cache-version1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/install.js',
  '/scripts/luxon-1.11.4.js',
  '/imagenes/chiabattaDeJamonYQueso2.png',
  '/imagenes/croissantDeJamonYQueso.png',
  '/imagenes/croissantDeJamonYQueso2.png',
  '/imagenes/desayuno.png',
  '/imagenes/desayuno-encabezado.png',
  '/imagenes/empanadaDeCarne.png',
  '/imagenes/empanadaDeJamonYQueso.png',
  '/imagenes/empanadaDePollo.png',
  '/imagenes/pizza-para-llevar.png',
  '/imagenes/tarta-calabaza.png',
  '/imagenes/tarta-humita.png',
  '/imagenes/QR.png',
  '/imagenes/icons/buffet.ico',
  '/imagenes/icons/buffet.png',
  '/imagenes/icons/carita-feliz.png',
  '/imagenes/icons/icon-128x128.png',
  '/imagenes/icons/icon-144x144.png',
  '/imagenes/icons/icon-152x152.png',
  '/imagenes/icons/icon-192x192.png',
  '/imagenes/icons/icon-512x512.png',
  '/imagenes/icons/icons-buffet.png',
  '/css/estilos.css',
];


self.addEventListener('install', function(evt){
  evt.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
);

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  // CODELAB: Remove previous cached data from disk.
	evt.waitUntil(
		caches.keys().then((keyList) => {
			  return Promise.all(keyList.map((key) => {
			if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
			  console.log('[ServiceWorker] Removing old cache', key);
			  return caches.delete(key);
			}
		  }));
		})
	);
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	  evt.respondWith(
		  caches.open(DATA_CACHE_NAME).then((cache) => {
			return fetch(evt.request)
				.then((response) => {
				  // If the response was good, clone it and store it in the cache.
				  if (response.status === 200) {
					cache.put(evt.request.url, response.clone());
				  }
				  return response;
				}).catch((err) => {
				  // Network request failed, try to get it from the cache.
				  return cache.match(evt.request);
				});
		  }));
	  return;

	evt.respondWith(
		caches.open(CACHE_NAME).then((cache) => {
		  return cache.match(evt.request)
			  .then((response) => {
				return response || fetch(evt.request);
			  });
		})
	);

/*	evt.respondWith(
		caches.match(evt.request)
			.then(function(response) {
			  // Cache hit - return response
			  if (response) {
				return response;
			  }
			  
			  var fetchRequest = evt.request.clone();
			  
			  return fetch(fetchRequest).then(
				function(response) {
				  // Check if we recived a valid response
				  if(!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				  }
				  
				  var responseToCache = response.clone();
				  caches.open(CACHE_NAME)
					  .then(function(cache) {
						cache.put(evt.request, responseToCache);
					  });

					return response;
				}
			  );
			})
	); */
});

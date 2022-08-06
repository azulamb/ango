const cacheName = 'ango_pwa_v1.0.0';
const appShellFiles = [
	'/ango/',
	'/ango/app.js',
	'/ango/favicon.svg',
	'/ango/index.html',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache.addAll(contentToCache);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request).then((response) => {
				return caches.open(cacheName).then((cache) => {
					cache.put(event.request, response.clone());
					return response;
				});
			});
		})
	);
});

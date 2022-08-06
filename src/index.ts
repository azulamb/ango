/// <reference path="./ango-contents.ts" />
/// <reference path="./ascii-code.ts" />
/// <reference path="./morse-code.ts" />

customElements.whenDefined('ango-contents.ts').then(() => {
});

if (location.protocol === 'https:' && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js');

	async function unregister() {
		await navigator.serviceWorker.getRegistrations().then((registrations) => {
			let count = 0;
			for(const registration of registrations) {
				registration.unregister();
				++count;
			}
			console.log(`Unregister ServiceWorker(${count})`);
		});
		await caches.keys().then(function(keys) {
			return Promise.all(keys.map((cacheName) => {
				if (cacheName) {
					console.log(`Delete cache: ${cacheName}`);
					return caches.delete(cacheName);
				}
				return Promise.resolve();
			})).then(() =>{
				console.log('Delete caches complete!');
			}).catch((error) => {
				console.error(error);
			});
		});
	}
}

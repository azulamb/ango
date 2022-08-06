/// <reference path="./ango-contents.ts" />
/// <reference path="./ascii-code.ts" />
/// <reference path="./morse-code.ts" />

customElements.whenDefined('ango-contents.ts').then(() => {
});

class ServiceWorkerManager {
	static enable() {
		localStorage.removeItem('sw:disable');
	}

	static disable() {
		localStorage.setItem('sw:disable', 'true');
	}

	static isEnable() {
		return location.protocol === 'https:' &&
			localStorage.getItem('sw:disable') !== null &&
			'serviceWorker' in navigator;
	}

	static registered() {
		if (!this.isEnable()) {
			return Promise.reject(new Error('Cannot register ServiceWorker.'));
		}

		return navigator.serviceWorker.getRegistrations().then((registrations) => {
			return 0 < registrations.length;
		});
	}

	static register() {
		if (this.isEnable()) {
			return navigator.serviceWorker.register('./sw.js');
		}
		return Promise.reject(new Error('Cannot register ServiceWorker.'));
	}

	static async unregister() {
		if (!this.isEnable()) {
			return Promise.reject(new Error('Cannot register ServiceWorker.'));
		}

		await navigator.serviceWorker.getRegistrations().then((registrations) => {
			let count = 0;
			for (const registration of registrations) {
				registration.unregister();
				++count;
			}
			console.log(`Unregister ServiceWorker(${count})`);
		});
		await caches.keys().then(function (keys) {
			return Promise.all(keys.map((cacheName) => {
				if (cacheName) {
					console.log(`Delete cache: ${cacheName}`);
					return caches.delete(cacheName);
				}
				return Promise.resolve();
			})).then(() => {
				console.log('Delete caches complete!');
			}).catch((error) => {
				console.error(error);
			});
		});
	}
}

ServiceWorkerManager.register();

class ServiceWorkerManager {
	static enable() {
		localStorage.removeItem('sw:disable');
	}

	static disable() {
		localStorage.setItem('sw:disable', 'true');
	}

	static toggle() {
		if (this.disableUser()) {
			// Disable -> Enable.
			this.enable();
		} else {
			// Enable -> Disable.
			this.disable();
		}

		return !this.disableUser();
	}

	static isEnable() {
		return location.protocol === 'https:' &&
			this.disableUser() &&
			'serviceWorker' in navigator;
	}

	static disableUser() {
		return localStorage.getItem('sw:disable') !== null;
	}

	static registered() {
		if (!this.isEnable()) {
			return Promise.reject(new Error('Cannot register ServiceWorker.'));
		}

		return navigator.serviceWorker.getRegistrations().then((registrations) => {
			if (0 < registrations.length) {
				return Promise.resolve();
			}
			return Promise.reject(new Error('Unregister ServiceWorker.'));
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

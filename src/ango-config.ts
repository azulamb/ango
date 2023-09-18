((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'ango-config';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement {
			get name() {
				return 'Config';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents[page]) { display: none; }`,
					'h1 { display: block; width: 4rem; height: 4rem; background: center no-repeat url(./favicon.svg); margin: 0.5rem auto; overflow: hidden; text-indent: 8rem; }',
					'div, p { font-size: 1rem; margin: 0.5rem auto; width: 100%; max-width: 40rem; }',
				].join('');

				const h1 = document.createElement('h1');
				h1.textContent = 'ango';
				const detail = Common.p('何らかの謎解き系の暗号解読に使えそうなツール群です。').get();

				const dl = Common.dl().get();

				dl.appendChild(Common.dt('Remove ServiceWorker.').get());
				dl.appendChild(
					Common.dd(
						Common.button('Remove', () => {
							ServiceWorkerManager.unregister();
						}).get(),
					).get(),
				);

				dl.appendChild(Common.dt('Register ServiceWorker.').get());
				dl.appendChild(
					Common.dd(
						Common.button('Register', () => {
							ServiceWorkerManager.register();
						}).get(),
					).get(),
				);

				function updateSwitch(enable: boolean) {
					switchTitle.textContent = `Switch ServiceWorker. [${enable ? 'Enable' : 'Disable'}]`;
					switchSW.textContent = enable ? 'Deactivate' : 'Activate';
				}
				const switchTitle = Common.dt('Switch ServiceWorker.').get();
				const switchSW = Common.button('', () => {
					updateSwitch(ServiceWorkerManager.toggle());
				}).get();
				updateSwitch(!ServiceWorkerManager.disableUser());
				dl.appendChild(switchTitle);
				dl.appendChild(Common.dd(switchSW).get());

				const config = Common.div(dl).get();

				const contents = Common.div().get();
				contents.appendChild(h1);
				contents.appendChild(detail);
				contents.appendChild(config);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				this.dispatchEvent(new CustomEvent('register'));
			}
		},
	);
});

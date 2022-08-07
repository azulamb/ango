((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'ango-config';
	if (customElements.get(tagname)) {
		return;
	}

	const DL = {
		dt: (title: string) => {
			const dt = document.createElement('dt');
			dt.textContent = title;
			return dt;
		},
		dd: (content: string | HTMLElement) => {
			const dd = document.createElement('dd');
			if (typeof content === 'string') {
				dd.textContent = content;
			} else {
				dd.appendChild(content);
			}
			return dd;
		},
		button: (text: string, callback: () => unknown) => {
			const button = document.createElement('button');
			button.textContent = text;
			button.addEventListener('click', callback);
			return button;
		},
	};

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
				const detail = document.createElement('p');
				detail.textContent = '何らかの謎解き系の暗号解読に使えそうなツール群です。';

				const dl = document.createElement('dl');

				dl.appendChild(DL.dt('Remove ServiceWorker.'));
				dl.appendChild(DL.dd(DL.button('Remove', () => {
					ServiceWorkerManager.unregister();
				})));

				dl.appendChild(DL.dt('Register ServiceWorker.'));
				dl.appendChild(DL.dd(DL.button('Register', () => {
					ServiceWorkerManager.register();
				})));

				function updateSwitch(enable: boolean) {
					switchTitle.textContent = `Switch ServiceWorker. [${enable ? 'Enable' : 'Disable'}]`;
					switchSW.textContent = enable ? 'Deactivate' : 'Activate';
				}
				const switchTitle = DL.dt('Switch ServiceWorker.');
				const switchSW = DL.button('', () => {
					updateSwitch(ServiceWorkerManager.toggle());
				});
				updateSwitch(!ServiceWorkerManager.disableUser());
				dl.appendChild(switchTitle);
				dl.appendChild(DL.dd(switchSW));

				const config = document.createElement('div');
				config.appendChild(dl);

				const contents = document.createElement('div');
				contents.appendChild(h1);
				contents.appendChild(detail);
				contents.appendChild(config);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				(<AngoContentsElement> this.parentElement).addContent(tagname, this);
			}
		},
	);
});

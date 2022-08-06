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
	customElements.define(
		tagname,
		class extends HTMLElement {
			protected table: HTMLTableElement;
			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
				].join('');

				const h1 = document.createElement('h1');
				h1.textContent = 'ango';
				const detail = document.createElement('p');
				detail.textContent = '何らかの謎解き系の暗号解読に使えそうなツール群です。';

				const contents = document.createElement('div');
				contents.appendChild(h1);
				contents.appendChild(detail);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				(<AngoContentsElement> this.parentElement).addContent(tagname, 'ASCII');
			}
		},
	);
});

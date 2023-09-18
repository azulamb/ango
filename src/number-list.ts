((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'number-list';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected table: HTMLTableElement;

			get name() {
				return 'Number list';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					'',
				].join('');

				const contents = document.createElement('div');
				contents.appendChild(document.createElement('slot'));

				shadow.appendChild(style);
				shadow.appendChild(contents);

				this.dispatchEvent(new CustomEvent('register'));
			}
		},
	);
});

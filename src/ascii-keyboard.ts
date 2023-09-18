((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'ascii-keyboard';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected table: HTMLTableElement;

			get name() {
				return 'ASCII Keyboard';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div { display: grid; grid-template-rows: 2rem 1fr; grid-template-columns: calc(100% - 2rem) 2rem; }',
					':host > div > div:not(:last-child) { overflow: hidden; }',
					':host > div > div:not(:last-child) > slot { display: grid; width: 100%; height: 100%; }',
					':host > div > div:last-child { display: flex; flex-wrap: wrap; justify-content: center; width: 100%; grid-row: 2 / 3; grid-column: 1 / 3; }',
				].join('');

				const result = document.createElement('div');
				result.appendChild(((slot) => {
					slot.name = 'result';
					return slot;
				})(document.createElement('slot')));
				const clear = document.createElement('div');
				clear.appendChild(((slot) => {
					slot.name = 'clear';
					return slot;
				})(document.createElement('slot')));

				const buttons = document.createElement('div');
				buttons.appendChild(document.createElement('slot'));

				const contents = document.createElement('div');
				contents.appendChild(result);
				contents.appendChild(clear);
				contents.appendChild(buttons);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				((input) => {
					(<HTMLButtonElement> this.querySelector('button[slot="clear"]')).addEventListener('click', () => {
						input.value = '';
					});
					this.querySelectorAll('button:not([slot])').forEach((button) => {
						const character = String.fromCharCode(parseInt(button.querySelector('span')?.textContent || '') || 0);
						button.addEventListener('click', () => {
							input.value += character;
						});
					});
				})(<HTMLInputElement> this.querySelector('input'));

				this.dispatchEvent(new CustomEvent('register'));
			}
		},
	);
});

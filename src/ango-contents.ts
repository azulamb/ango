interface AngoContentsElement extends HTMLElement {
	addContent(tag: string, name: string): void;
	page: string;
}

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'ango-contents';
	if (customElements.get(tagname)) {
		return;
	}
	customElements.define(
		tagname,
		class extends HTMLElement implements AngoContentsElement {
			protected menu: HTMLSelectElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; width: 100%; height: 100%; --header: 2rem; background: var(--back); }',
					':host > div { width: 100%; height: 100%; display: grid; grid-template-rows: var(--header) 1fr; }',
					':host > div > header { box-sizing: border-box; padding: 0 0 0 var(--header); background: left no-repeat url(./favicon.svg); height: 100%; display: grid; grid-template-rows: 100%; }',
					':host > div > header > select { font-size: var(--header); border: none; outline: none; }',
					':host > div > div { overflow: auto; }',
				].join('');

				this.menu = document.createElement('select');
				this.menu.addEventListener('change', () => {
					this.page = this.menu.options[this.menu.selectedIndex].value;
				});

				const header = document.createElement('header');
				header.appendChild(this.menu);

				const contents = document.createElement('div');
				contents.appendChild(document.createElement('slot'));

				const wrapper = document.createElement('div');
				wrapper.appendChild(header);
				wrapper.appendChild(contents);

				shadow.appendChild(style);
				shadow.appendChild(wrapper);

				const params = new URLSearchParams(location.search);
				const page = params.get('page');
				if (page) {
					this.page = page;
				}
			}

			addContent(tag: string, name: string) {
				const option = document.createElement('option');
				option.value = tag;
				option.textContent = name;
				if (this.page === tag) {
					option.selected = true;
				}

				this.menu.appendChild(option);
			}

			get page() {
				return this.getAttribute('page') || '';
			}

			set page(value) {
				const old = this.page;
				this.setAttribute('page', value || '');
				if (location.protocol !== 'https:') {
					return;
				}
				const page = this.page;
				if (old !== page) {
					const url = new URL(location.href);
					url.search = new URLSearchParams({ page: page }).toString();
					//location.replace(url);
				}
			}
		},
	);
});

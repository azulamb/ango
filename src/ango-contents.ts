interface AngoElement extends HTMLElement {
	readonly name: string;
}

interface AngoContentsElement extends HTMLElement {
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

				this.menu = Common.select().get();
				this.menu.addEventListener('change', () => {
					this.page = this.menu.options[this.menu.selectedIndex].value;
				});

				const header = document.createElement('header');
				header.appendChild(this.menu);

				const contents = Common.div(document.createElement('slot')).get();

				const wrapper = Common.div(
					header,
					contents,
				).get();

				shadow.appendChild(style);
				shadow.appendChild(wrapper);

				const params = new URLSearchParams(location.search);
				const page = params.get('page');
				if (page) {
					this.page = page;
				}
				this.addEventListener('register', (event) => {
					const target = <AngoElement> event.target;
					this.addContent(target.tagName, target);
				}, true);
			}

			addContent(tag: string, content: AngoElement) {
				tag = tag.replace(/[A-Z]/g, (char) => {
					return String.fromCharCode(char.charCodeAt(0) | 32);
				});
				const option = Common.option(content.name, tag).get();
				if (this.page === tag || (this.page === '' && tag === 'ango-config')) {
					option.selected = true;
				}

				this.menu.appendChild(option);

				// Sort options.
				const names: string[] = [];
				for (const child of this.children) {
					const name = (<AngoElement> child).name;
					if (name) {
						names.push(name);
					}
				}

				const options: HTMLOptionElement[] = [];
				for (const option of this.menu.children) {
					options.push(<HTMLOptionElement> option);
				}
				options.sort((a, b) => {
					return names.indexOf(a.textContent || '') - names.indexOf(b.textContent || '');
				});
				for (const option of options) {
					this.menu.appendChild(option);
				}
			}

			get page() {
				return this.getAttribute('page') || '';
			}

			set page(value) {
				if (value === 'ango-config') {
					value = '';
				}
				if (this.page === value) {
					return;
				}
				if (value) {
					this.setAttribute('page', value);
					const page = this.page;
					const url = new URL(location.href);
					url.searchParams.set('page', page);
					if (location.search !== url.search) {
						location.search = url.search;
					}
				} else {
					this.removeAttribute('page');
					const url = new URL(location.href);
					url.searchParams.delete('page');
					if (location.search !== url.search) {
						location.search = url.search;
					}
				}
			}
		},
	);
});

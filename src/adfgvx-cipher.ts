((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'adfgvx-cipher';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected table: HTMLElement;
			protected key: HTMLInputElement;
			protected adfgvx: HTMLInputElement;
			protected text: HTMLInputElement;
			protected mode = false;

			get name() {
				return 'ADFGVX Cipher';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div > input { display: block; margin: auto; font-size: 3vmin; width: 100%; }',
					':host > div > #table { width: 7em; font-size: 8vmin; margin: auto; text-align: center; line-height: 1em; display: grid; grid-template-rows: 1em 1em 1em 1em 1em 1em 1em; grid-template-columns: 1em 1em 1em 1em 1em 1em 1em; }',
					':host > div > #table > button { font-size: 6vmin; display: block; box-sizing: border-box; }',
					':host dialog { border: 0; background: transparent; padding: 0; }',
					':host dialog::backdrop { background: rgba(0, 0, 0, 0.3); }',
					':host dialog > div { padding: 1rem; font-size: 10vmin; background: var(--back); border-radius: 0.5rem; display: grid; grid-template-rows: 1em 1em 1em 1em 1em 1em; grid-template-columns: 1em 1em 1em 1em 1em 1em; }',
					':host dialog > div > button { font-size: 8vmin; }',
				].join('');

				this.table = Common.div().get({ id: 'table' });
				const def = [...'dhxmu4p3j6aoibzv9w1n70qkfslyc8tr5e2g'];
				const chars = [...'ADFGVX'];
				for (let x = -1; x < 6; ++x) {
					this.table.appendChild(Common.span(x < 0 ? '' : chars[x]).get());
				}
				let target: HTMLButtonElement;
				for (let y = 0; y < 6; ++y) {
					for (let x = -1; x < 6; ++x) {
						if (x < 0) {
							this.table.appendChild(Common.span(chars[y]).get());
						} else {
							const button = Common.button(def[y * 6 + x], () => {
								target = button;
								dialog.showModal();
							}).get();
							button.id = chars[y] + chars[x];
							this.table.appendChild(button);
						}
					}
				}

				const dialogContents = Common.div(...[...'abcdefghijklmnopqrstuvwxyz0123456789'].map((char) => {
					const button = Common.button(char, () => {
						target.textContent = char;
						dialog.close();
					}).get();
					return button;
				})).get();
				dialogContents.addEventListener('click', (event) => {
					event.stopPropagation();
				});
				const dialog = Common.dialog(dialogContents).get();
				dialog.addEventListener('click', (event) => {
					event.stopPropagation();
					dialog.close();
				});

				this.key = Common.inputText('Key').get();
				this.key.addEventListener('input', () => {
					this.update();
				});
				this.adfgvx = Common.inputText('Vigenere').get();
				this.adfgvx.addEventListener('input', () => {
					this.mode = false;
					this.update();
				});
				this.text = Common.inputText('Text').get();
				this.text.addEventListener('input', () => {
					this.mode = true;
					this.update();
				});

				const contents = document.createElement('div');
				contents.appendChild(this.key);
				contents.appendChild(this.adfgvx);
				contents.appendChild(this.text);
				contents.appendChild(this.table);

				shadow.appendChild(style);
				shadow.appendChild(contents);
				shadow.appendChild(dialog);

				(<AngoContentsElement> this.parentElement).addContent(tagname, this);
			}

			protected update() {
				const values: { [key: string]: HTMLButtonElement } = {};
				const keys: { [key: string]: string } = {};
				[...this.table.querySelectorAll('button')].map((button) => {
					const value = button.textContent || '';
					values[value] = button;
					keys[Common.toLowerCase(button.id)] = value;
					return;
				});

				const key = [...this.key.value].filter((char, index, array) => {
					return array.indexOf(char) === index;
				}).join('');
				const tkey = (() => {
					const list = key.split('').sort();
					return key.split('').map((char) => {
						return list.indexOf(char);
					});
				})();

				if (this.mode) {
					// Text -> ADFGVX
					const stage1 = Common.toLowerCase(this.text.value).split('').map((char) => {
						return values[char].id;
					}).join('');

					const stage2: string[][] = [];
					stage1.split('').map((char, index) => {
						const i = index % tkey.length;
						if (!stage2[i]) {
							stage2[i] = [];
						}
						stage2[i].push(char);
					});

					this.adfgvx.value = tkey.map((v, index) => {
						return stage2[tkey.indexOf(index)].join('');
					}).join('');
				} else {
					// ADFGVX -> Text
					const length = this.adfgvx.value.length;
					const max = tkey.map((v, index) => {
						return Math.floor(length / tkey.length) + (index < length % tkey.length ? 1 : 0);
					});
					const stage1: string[][] = tkey.map(() => {
						return [];
					});
					const chars = Common.toLowerCase(this.adfgvx.value).split('');
					for (let i = 0; i < tkey.length; ++i) {
						const index = tkey.indexOf(i);
						const m = max[index];
						for (let i = 0; i < m; ++i) {
							stage1[index].push(chars.shift() || '');
						}
					}

					const stage2: string[] = [];
					const m = max.reduce((prev, length) => {
						return Math.max(prev, length);
					}, 0);
					for (let i = 0; i < m; ++i) {
						for (const list of stage1) {
							const char = list.shift();
							if (char) {
								stage2.push(char);
							}
						}
					}
					const stage3: string[] = [];
					for (let i = 0; i < stage2.length; i += 2) {
						stage3.push(stage2[i] + stage2[i + 1]);
					}

					this.text.value = stage3.map((key) => {
						return keys[key];
					}).join('');
				}
			}
		},
	);
});

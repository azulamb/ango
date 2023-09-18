((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'vigenere-cipher';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected table: HTMLTableElement;
			protected kv: { [keys: string]: string } = {};
			protected value: { [keys: string]: string } = {};
			protected key: HTMLInputElement;
			protected vigenere: HTMLInputElement;
			protected text: HTMLInputElement;
			protected mode = false;

			get name() {
				return 'Vigenere Cipher';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div > table { font-size: calc(100vmin/40); text-align: center; margin: auto; }',
					':host > div > input { display: block; margin: auto; font-size: 3vmin; width: 100%; }',
				].join('');

				this.table = Common.table().get();
				const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
				const tr = Common.tr(Common.td('').get()).get();
				for (const x of alphabet) {
					const td = Common.td(x).get();
					tr.appendChild(td);
				}
				this.table.appendChild(tr);
				for (let r = 0; r < alphabet.length; ++r) {
					const y = alphabet[r];
					const tr = Common.tr(Common.td(y).get()).get();
					for (let i = 0; i < alphabet.length; ++i) {
						const x = alphabet[(r + i) % alphabet.length];
						const key = y + alphabet[i];
						const td = Common.td(x).get({ id: key });
						tr.appendChild(td);
						this.kv[key] = x;
						this.value[y + x] = alphabet[i];
					}
					this.table.appendChild(tr);
				}

				this.key = Common.inputText('Key').get();
				this.key.addEventListener('input', () => {
					this.update();
				});
				this.vigenere = Common.inputText('Vigenere').get();
				this.vigenere.addEventListener('input', () => {
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
				contents.appendChild(this.vigenere);
				contents.appendChild(this.text);
				contents.appendChild(this.table);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				this.dispatchEvent(new CustomEvent('register'));
			}

			protected update() {
				const key = [...Common.toUpperCase(this.key.value)];
				if (key.length <= 0) {
					return;
				}

				if (this.mode) {
					// Text -> Vigenere
					this.vigenere.value = [...Common.toUpperCase(this.text.value)].map((char, index) => {
						const y = key[index % key.length];
						console.log(`${y} ${char} => ${this.kv[y + char]}`);
						return this.kv[y + char];
					}).join('');
				} else {
					// Vigenere -> Text
					this.text.value = [...Common.toUpperCase(this.vigenere.value)].map((char, index) => {
						const y = key[index % key.length];
						console.log(`${y} ${char} => ${this.value[y + char]}`);
						return this.value[y + char];
					}).join('');
				}
			}
		},
	);
});

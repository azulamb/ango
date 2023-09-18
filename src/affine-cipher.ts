((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'affine-cipher';
	if (customElements.get(tagname)) {
		return;
	}

	class Affine {
		protected characters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

		public setCharacters(characters: string) {
			this.characters = [...characters];
		}

		public encrypt(text: string, a: number, b: number) {
			const m = this.characters.length;
			const table = this.characters.map((char, index) => {
				return this.characters[(a * index + b) % m];
			});
			return [...text].map((char) => {
				const index = this.characters.indexOf(char);
				if (index < 0) {
					return char;
				}
				return table[index];
			}).join('');
		}

		public decrypt(text: string, a: number, b: number) {
			const m = this.characters.length;
			const table = this.characters.map((char, index) => {
				return this.characters[(a * index + b) % m];
			});
			return [...text].map((char) => {
				const index = table.indexOf(char);
				if (index < 0) {
					return char;
				}
				return this.characters[index];
			}).join('');
		}

		public toString() {
			return this.characters.join('');
		}
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			get name() {
				return 'Affine Cipher';
			}

			protected affine: Affine;

			constructor() {
				super();

				this.affine = new Affine();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; width: 100%; height: 100%; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div { width: 100%; height: 100%; display: grid; grid-template-columns: 2rem calc(50% - 3rem) 2rem 2rem calc(50% - 3rem); grid-template-rows: 1fr 1fr 3rem 3rem; grid-template-areas: "a a b c c" "a a d c c" "x f _ y g" "m e e e e"; overflow: hidden; }',
					'input { font-size: 3rem; }',
					'textarea { font-size: 3rem; }',
					'span { font-size: 2rem; text-align: center; }',
					':host(:not([mode="cipher"])) #encryption, :host([mode="cipher"]) #decryption { background: #c3d0e5; }',
				].join('');

				const update = () => {
					const valueA = parseInt(a.value);
					const valueB = parseInt(b.value);
					if (this.mode === 'cipher') {
						rawText.value = this.affine.decrypt(cipherText.value, valueA, valueB);
					} else {
						cipherText.value = this.affine.encrypt(rawText.value, valueA, valueB);
					}
				};

				const rawText = document.createElement('textarea');
				rawText.style.gridArea = 'a';
				rawText.placeholder = 'Text.';
				const cipherText = document.createElement('textarea');
				cipherText.style.gridArea = 'c';
				cipherText.placeholder = 'Cipher text.';
				const encryption = document.createElement('button');
				encryption.style.gridArea = 'b';
				encryption.textContent = '>';
				encryption.id = 'encryption';
				encryption.addEventListener('click', () => {
					this.mode = 'raw';
					update();
				});
				const decryption = document.createElement('button');
				decryption.style.gridArea = 'd';
				decryption.textContent = '<';
				decryption.id = 'decryption';
				decryption.addEventListener('click', () => {
					this.mode = 'cipher';
					update();
				});
				const characters = document.createElement('input');
				characters.style.gridArea = 'e';
				characters.value = this.affine.toString();
				characters.addEventListener('change', () => {
					this.affine.setCharacters(characters.value);
					update();
				});
				const textM = document.createElement('span');
				textM.style.gridArea = 'm';
				textM.textContent = 'm';
				const textA = document.createElement('span');
				textA.style.gridArea = 'x';
				textA.textContent = 'a';
				const a = document.createElement('input');
				a.style.gridArea = 'f';
				a.type = 'number';
				a.step = '1';
				a.value = '1';
				a.addEventListener('change', update);
				const textB = document.createElement('span');
				textB.style.gridArea = 'y';
				textB.textContent = 'b';
				const b = document.createElement('input');
				b.style.gridArea = 'g';
				b.type = 'number';
				b.step = '1';
				b.value = '1';
				b.addEventListener('change', update);

				const contents = document.createElement('div');
				contents.appendChild(rawText);
				contents.appendChild(encryption);
				contents.appendChild(decryption);
				contents.appendChild(cipherText);
				contents.appendChild(textA);
				contents.appendChild(a);
				contents.appendChild(textB);
				contents.appendChild(b);
				contents.appendChild(textM);
				contents.appendChild(characters);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				this.dispatchEvent(new CustomEvent('register'));
			}

			get mode() {
				return this.getAttribute('mode') === 'cipher' ? 'cipher' : 'raw';
			}

			set mode(value) {
				this.setAttribute('mode', value === 'cipher' ? 'cipher' : 'raw');
			}
		},
	);
});

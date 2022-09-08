((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'base64-converter';
	if (customElements.get(tagname)) {
		return;
	}

	class Base64 {
		protected base64Table: string;
		protected emptyString: string;

		constructor() {
			this.table = ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'];
			this.empty = '=';
		}

		set table(table: string[]) {
			this.base64Table = table.join('');
		}

		get table() {
			return [...this.base64Table];
		}

		set empty(empty: string) {
			this.emptyString = empty;
		}

		get empty() {
			return this.emptyString;
		}

		public toString(base64: string) {
			return new TextDecoder().decode(this.toUint8Array(base64));
		}

		public toUint8Array(base64: string) {
			const str = base64.replace(new RegExp(this.emptyString, 'g'), '');
			if (str.match(new RegExp(`/[^${this.base64Table.replace(/[^0-9a-zA-Z]/g, '\\$1')}]/`))) {
				throw new Error('Invalid value. Exists illegal characters.');
			}
			const chars = [...str];
			//if ( chars.length % 4 ) { throw new Error( 'Invalid value. Not Base64 string.' ); }

			const data = new Uint8Array(((chars.length + (chars.length % 4 ? 4 : 0)) >> 2) * 3);

			const converter = (char: string) => {
				const index = this.base64Table.indexOf(char);
				return index < 0 ? 0 : index;
			};
			let w = 0;
			for (let i = 0; i < chars.length; i += 4) {
				const [a, b, c, d] = [
					converter(chars[i]),
					converter(chars[i + 1]),
					converter(chars[i + 2]),
					converter(chars[i + 3]),
				];

				// a[OOOOOO]b[OO----]
				if (w < data.length) data[w++] = (a << 2) | (b >> 4);
				// b[--OOOO]c[OOOO--]
				if (w < data.length && i + 2 < chars.length) data[w++] = ((b & 0xF) << 4) | (c >> 2);
				// c[----OO]d[OOOOOO]
				if (w < data.length && i + 3 < chars.length) data[w++] = ((c & 0x3) << 6) | d;
			}

			if (w === data.length) return data;

			const newData = new Uint8Array(w);
			newData.set(data.slice(0, w));

			return newData;
		}

		public fromString(data: string) {
			return this.fromUint8Array((new TextEncoder()).encode(data));
		}

		public fromUint8Array(buffer: Uint8Array) {
			const base64: string[] = [];

			for (let i = 0; i < buffer.length; i += 3) {
				const [a, b, c] = [buffer[i], buffer[i + 1] || 0, buffer[i + 2] || 0];
				// a[OOOOOO--]
				base64.push(this.base64Table[a >> 2]);
				// a[------OO]b[OOOO----]
				base64.push(this.base64Table[((a & 0x3) << 4) | (b >> 4)]);
				// b[----OOOO]c[OO------]
				base64.push(i + 1 < buffer.length ? this.base64Table[(b & 0xF) << 2 | (c >> 6)] : this.emptyString);
				// c[--OOOOOO]
				base64.push(i + 2 < buffer.length ? this.base64Table[c & 0x3F] : this.emptyString);
			}

			return base64.join('');
		}
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected base64: Base64;

			get name() {
				return 'Base64';
			}

			constructor() {
				super();

				this.base64 = new Base64();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div > textarea { display: block; margin: auto; font-size: 3vmin; width: 100%; }',
					':host > div > table { margin: auto; }',
					':host > div > table > tr > td > button { display: block; width: 100%; cursor: pointer; font-size: 8vmin; }',
					':host dialog { border: 0; background: transparent; padding: 0; }',
					':host dialog::backdrop { background: rgba(0, 0, 0, 0.3); }',
					':host dialog > div { padding: 1rem; font-size: 10vmin; background: var(--back); border-radius: 0.5rem; display: grid; grid-template-rows: 1em 1em; grid-template-columns: 50% 50%; }',
					':host dialog > div > div { line-height: 11vmin; font-size: 8vmin; }',
					':host dialog > div > div::after { content: "→"; }',
					':host dialog > div > select { font-size: 8vmin; }',
					':host dialog > div > button { font-size: 8vmin; grid-area: 2 / 1 / 3 / 3; cursor: pointer; }',
				].join('');

				const text = Common.textarea('Text').get();
				text.addEventListener('input', () => {
					base64.value = this.base64.fromString(text.value);
				});

				const base64 = Common.textarea('Base64').get();
				base64.addEventListener('input', () => {
					text.value = this.base64.toString(base64.value);
				});

				const select = Common.select().get();
				const before = Common.div().get();
				const table = Common.table().get();
				for (let y = 0; y < 8; ++y) {
					const tr = Common.tr().get();
					table.appendChild(tr);
					for (let x = 0; x < 8; ++x) {
						const index = y * 8 + x;
						const value = this.base64.table[index];
						const td = Common.td(
							Common.button(
								value,
								() => {
									before.textContent = this.base64.table[index];
									before.dataset.index = index + '';
									dialog.showModal();
								},
							).get(),
						).get();
						tr.appendChild(td);
						const option = Common.option(value, value).get();
						select.appendChild(option);
					}
				}
				table.appendChild(
					Common.tr(
						Common.td(
							Common.button(this.base64.empty, () => {
								before.textContent = this.base64.empty;
								dialog.showModal();
							}).get(),
						).get({ colspan: 8 }),
					).get(),
				);
				select.appendChild(Common.option(this.base64.empty, this.base64.empty).get());
				select.appendChild(Common.option('-', '-').get());
				select.appendChild(Common.option('.', '.').get());
				select.appendChild(Common.option('_', '_').get());
				select.appendChild(Common.option(':', ':').get());
				select.appendChild(Common.option('!', '!').get());

				const update = Common.button('Change', () => {
					const value = select.options[select.selectedIndex].value;
					if (before.dataset.index) {
						const index = parseInt(before.dataset.index);
						const table = this.base64.table;
						table[index] = value;
						this.base64.table = table;
					} else {
						this.base64.empty = value;
					}
					base64.value = this.base64.fromString(text.value);
					dialog.close();
				}).get();
				const dialogContents = Common.div(
					before,
					select,
					update,
				).get();
				dialogContents.addEventListener('click', (event) => {
					event.stopPropagation();
				});
				const dialog = Common.dialog(dialogContents).get();
				dialog.addEventListener('click', (event) => {
					event.stopPropagation();
					dialog.close();
				});

				const contents = document.createElement('div');
				contents.appendChild(text);
				contents.appendChild(base64);
				contents.appendChild(table);
				contents.appendChild(dialog);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				(<AngoContentsElement> this.parentElement).addContent(tagname, this);
			}
		},
	);
});

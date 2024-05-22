((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'base64-hex';
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
				if (w < data.length) {
					data[w++] = (a << 2) | (b >> 4);
				}
				// b[--OOOO]c[OOOO--]
				if (w < data.length && i + 2 < chars.length) {
					data[w++] = ((b & 0xF) << 4) | (c >> 2);
				}
				// c[----OO]d[OOOOOO]
				if (w < data.length && i + 3 < chars.length) {
					data[w++] = ((c & 0x3) << 6) | d;
				}
			}

			if (w === data.length) {
				return data;
			}

			const newData = new Uint8Array(w);
			newData.set(data.slice(0, w));

			return newData;
		}
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected base64: Base64;

			get name() {
				return 'Base64(Hex)';
			}

			constructor() {
				super();

				this.base64 = new Base64();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; height: 100%; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					'::slotted(input) { width: 100%; }',
					'::slotted(span) { font-size: 1.5rem; display: inline-block; padding: 0.1rem 0.2rem; }',
					'::slotted(span)::before { content: "0x"; }',
				].join('');

				const inputSlot = document.createElement('slot');
				inputSlot.name = 'base64';
				const inputArea = document.createElement('div');
				inputArea.appendChild(inputSlot);
				const input = <HTMLInputElement> this.querySelector('[slot="base64"]');
				input.addEventListener('input', () => {
					const data = this.base64.toUint8Array(input.value);
					this.updateHex(data);
				});
				const dataArea = document.createElement('div');
				dataArea.appendChild(document.createElement('slot'));

				const contents = document.createElement('div');
				contents.appendChild(inputArea);
				contents.appendChild(dataArea);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				this.dispatchEvent(new CustomEvent('register'));
			}

			protected updateHex(data: Uint8Array) {
				const items = [...this.querySelectorAll('span')];
				let i = 0;
				for (; i < items.length && i < data.length; ++i) {
					items[i].textContent = data[i].toString(16).padStart(2, '0');
				}
				for (; i < data.length; ++i) {
					const span = document.createElement('span');
					span.textContent = data[i].toString(16).padStart(2, '0');
					this.appendChild(span);
				}
				while (data.length < items.length) {
					const item = <HTMLElement> items.pop();
					this.removeChild(item);
				}
			}
		},
	);
});

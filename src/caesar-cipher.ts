((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'caesar-cipher';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected base: string[];
			protected convert: string[];
			protected baseRow: HTMLTableRowElement;
			protected convertRow: HTMLTableRowElement;
			protected centerColumn: HTMLTableCellElement;
			protected shift: HTMLInputElement;
			protected rawText: HTMLTextAreaElement;
			protected cipherText: HTMLTextAreaElement;

			get name() {
				return 'Caesar';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; height: 100%; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div { display: grid; grid-template-rows: 1fr 10rem; height: 100%; }',
					':host > div > div { display: grid; grid-template-areas: "a b c" "a d c"; grid-template-rows: 1fr 1fr; grid-template-columns: 1fr 3rem 1fr; }',
					':host > div > div > textarea:first-child { grid-area: a; }',
					':host > div > div > textarea:last-child { grid-area: c; }',
					'table { font-size: 2rem; margin: auto; text-align: center; }',
					'td > div { display: grid; grid-template-columns: 3rem 1fr 3rem; height: 3rem; grid-template-rows: 3rem; width: 100%; }',
					'td > div > input { font-size: 3rem; text-align: center; width: 100%; box-sizing: border-box; }',
					'td > div > button { font-size: 3rem; width: 3rem; height: 3rem; line-height: 3rem; }',
					'button { font-size: 3rem; cursor: pointer; box-sizing: border-box; }',
					'textarea { font-size: 2rem; }',
					':host(:not([mode="cipher"])) #encryption, :host([mode="cipher"]) #decryption { background: #c3d0e5; }',
				].join('');

				this.baseRow = Common.tr().get();
				this.convertRow = Common.tr().get();
				this.centerColumn = Common.td().get();

				const table = Common.table(
					this.baseRow,
					Common.tr(this.centerColumn).get(),
					this.convertRow,
				).get();

				const sub = Common.button('<', () => {
					this.shift.value = `${parseInt(this.shift.value) - 1}`;
					this.updateTable();
				}).get();
				const add = Common.button('>', () => {
					this.shift.value = `${parseInt(this.shift.value) + 1}`;
					this.updateTable();
				}).get();
				this.shift = Common.inputNumber().get();
				this.shift.step = '1';
				this.shift.addEventListener('input', () => {
					this.updateTable();
				});

				const controller = Common.div(
					sub,
					this.shift,
					add,
				).get();

				this.centerColumn.appendChild(controller);

				this.rawText = Common.textarea('Text.').get();
				this.rawText.addEventListener('input', () => {
					this.encrypt();
				});

				this.cipherText = Common.textarea('Cipher text.').get();
				this.cipherText.addEventListener('input', () => {
					this.decrypt();
				});

				const encryption = Common.button('>', () => {
					this.encrypt();
				}).get({id: 'encryption'});

				const decryption = Common.button('<', () => {
					this.decrypt();
				}).get({id: 'decryption'});

				const convertArea = Common.div(
					this.rawText,
					encryption,
					decryption,
					this.cipherText,
				).get();

				const contents = Common.div(
					convertArea,
					table,
				).get();

				shadow.appendChild(style);
				shadow.appendChild(contents);

				(<AngoContentsElement> this.parentElement).addContent(tagname, this);

				this.updateTable(0, [...'abcdefghijklmnopqrstuvwxyz']);
			}

			get mode() {
				return this.getAttribute('mode') === 'cipher' ? 'cipher' : 'raw';
			}

			set mode(value) {
				this.setAttribute('mode', value === 'cipher' ? 'cipher' : 'raw');
			}

			protected updateTable(shift?: number, table?: string[]) {
				if (shift === undefined) {
					shift = parseInt(this.shift.value);
				} else {
					this.shift.value = shift + '';
				}
				if (table) {
					this.base = table;
					this.baseRow.innerHTML = '';
					for (const char of this.base) {
						this.baseRow.appendChild(Common.td(char).get());
					}
					this.centerColumn.colSpan = this.base.length;
				}
				this.convert = [];
				this.convertRow.innerHTML = '';
				while (shift < 0) {
					shift += this.base.length;
				}
				for (let i = 0; i < this.base.length; ++i) {
					const char = this.base[(i + shift) % this.base.length];
					this.convert.push(char);
					this.convertRow.appendChild(Common.td(char).get());
				}
				if (this.mode === 'cipher') {
					this.decrypt(false);
				} else {
					this.encrypt(false);
				}
			}

			protected encrypt(update = true) {
				const text = Common.toLowerCase(this.rawText.value);
				this.cipherText.value = [...text].map((char) => {
					const index = this.base.indexOf(char);
					if (index < 0) {
						return char;
					}
					return this.convert[index];
				}).join('');
				if (update) {
					this.mode = 'raw';
				}
			}

			protected decrypt(update = true) {
				const text = Common.toLowerCase(this.cipherText.value);
				this.rawText.value = [...text].map((char) => {
					const index = this.convert.indexOf(char);
					if (index < 0) {
						return char;
					}
					return this.base[index];
				}).join('');
				if(update){
					this.mode = 'cipher';
				}
			}
		},
	);
});

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'ascii-code';
	if (customElements.get(tagname)) {
		return;
	}
	function createTd(text?: string) {
		const td = document.createElement('td');
		if (text) {
			td.textContent = text;
		}
		return td;
	}
	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			protected table: HTMLTableElement;

			get name() {
				return 'ASCII';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div { display: block; width: 100%; min-height: 100%; padding-bottom: 4rem; box-sizing: border: box; }',
					'table { width: 100%; }',
					'thead { position: sticky; top: 0; z-index: 10; }',
					'td { text-align: center; color: var(--front); }',
					'pre { font-size: 2rem; margin: 0; display: block; width: 50%; height: 2.5rem; line-height: 2.5rem; float: left; }',
					'td > div { font-size: 0.8rem; opacity: 0.5; }',
					'tr:nth-child(odd) { --back1: rgba(0, 0, 0, 0.05); }',
					'tr:nth-child(even) { --back2: rgba(0, 0, 0, 0.05); }',
					'tr:first-child { --back1: #d6e1f3; --back2: #c3d0e5; }',
					'td:nth-child(odd) { background: var(--back1); }',
					'td:nth-child(even) { background: var(--back2); }',
					'tr:nth-child(odd) > td:first-child { --back1: #d6e1f3; --back2: #c3d0e5; }',
					'tr:nth-child(even) > td:first-child { --back2: #d6e1f3; --back1: #c3d0e5; }',
					'tr:not(:first-child) > td:not(:first-child) { cursor: pointer; }',
					'div.input { width: 100%; height: 4rem; display: grid; grid-template-areas: "a b c" "a d c"; grid-template-columns: 4rem 1fr 4rem; grid-template-rows: 2rem 2rem; position: absolute; bottom: 0; overflow: hidden; }',
					'button { font-size: 3rem; line-height: 3rem; }',
					'div.input button:first-child { grid-area: a; }',
					'div.input button:last-child { grid-area: c; }',
					':host > div > table .selected { background: rgba(82, 179, 116, 0.46); }',
				].join('');

				const tr = document.createElement('tr');
				tr.appendChild(createTd());
				for (let i = 2; i <= 7; ++i) {
					tr.appendChild(createTd(`0x${i}`));
				}
				const thead = document.createElement('thead');
				thead.appendChild(tr);

				this.table = document.createElement('table');
				this.table.appendChild(thead);

				for (let n = 0; n < 16; ++n) {
					const tr = document.createElement('tr');
					tr.appendChild(createTd(n.toString(16)));
					this.table.appendChild(tr);
					for (let i = 2; i <= 7; ++i) {
						const num = i * 16 + n;

						const td = createTd();

						if (num < 127) {
							const char = document.createElement('pre');
							char.textContent = String.fromCharCode(num);

							const charCode = document.createElement('div');
							charCode.innerHTML = `${num}<br>0x${num.toString(16)}`;

							td.appendChild(char);
							td.appendChild(charCode);

							td.addEventListener('click', () => {
								code.value = `${code.value}0x${num.toString(16)}`;
								text.value = `${text.value}${String.fromCharCode(num)}`;
								this.select(i, n);
							});
						}

						tr.appendChild(td);
					}
				}

				const code = document.createElement('input');
				code.placeholder = 'Code';
				code.addEventListener('input', () => {
					const value = code.value.replace(/[^0-9a-fA-Fx]/g, '').replace(/0x/g, '');

					const codes: number[] = [];
					code.value = value.split('').map((value, index, array) => {
						if (index % 2) {
							return '';
						}
						const code = `0x${value}${array[index + 1] || ''}`;
						codes.push(parseInt(code, 16));
						return code;
					}, '').filter((value) => {
						return !!value;
					}).join('');

					text.value = codes.map((code) => {
						return String.fromCharCode(code);
					}).join('');
				});

				// !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}\~
				const text = document.createElement('input');
				text.placeholder = 'Text';
				text.addEventListener('input', () => {
					const value = text.value.replace(
						/[^ \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/0123456789\:\;\<\=\>\?\@ABCDEFGHIJKLMNOPQRSTUVWXYZ\[\\\]\^\_\`abcdefghijklmnopqrstuvwxyz\{\|\}\~]/g,
						'',
					);

					text.value = value;

					code.value = value.split('').map((char) => {
						return `0x${char.charCodeAt(0).toString(16)}`;
					}).join('');
				});

				const reset = document.createElement('button');
				reset.textContent = '↻';
				reset.addEventListener('click', () => {
					code.value = '';
					text.value = '';
				});

				const remove = document.createElement('button');
				remove.textContent = '⇦';
				remove.addEventListener('click', () => {
					const chars = text.value.split('');
					chars.pop();
					console.log(chars);
					text.value = chars.join('');
					code.value = chars.map((char) => {
						return `0x${char.charCodeAt(0).toString(16)}`;
					}).join('');
				});

				const inputs = document.createElement('div');
				inputs.classList.add('input');
				inputs.appendChild(reset);
				inputs.appendChild(code);
				inputs.appendChild(text);
				inputs.appendChild(remove);

				const contents = document.createElement('div');
				contents.appendChild(this.table);
				contents.appendChild(inputs);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				(<AngoContentsElement> this.parentElement).addContent(tagname, this);
			}

			protected select(x: number, y: number) {
				for (const element of this.table.querySelectorAll('.selected')) {
					element.classList.remove('selected');
				}
				const tr = this.table.querySelector(`tr:nth-child(${y + 2})`);
				if (tr) {
					tr.classList.add('selected');
				}
				for (const element of this.table.querySelectorAll(`td:nth-child(${x})`)) {
					element.classList.add('selected');
				}
			}
		},
	);
});

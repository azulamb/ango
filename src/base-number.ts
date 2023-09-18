((script, init) => {
	customElements.whenDefined('ango-contents').then(() => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'base-number';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements AngoElement {
			get name() {
				return 'BaseNumber';
			}

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; }',
					`:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
					':host > div { display: grid; grid-template-columns: 1fr 2rem; grid-template-rows: 2rem 2rem 2rem 2rem 1fr; grid-template-areas: "a x" "b x" "c x" "d x" "y y" "z z"; }',
					':host > div > input { display: block; margin: auto; font-size: 3vmin; width: 100%; box-sizing: border-box; text-align: right; }',
					':host > div > button { cursor: pointer; grid-area: x; }',
					':host > div > div > button { cursor: pointer; font-size: 2em; }',
					':host > div > div.option { grid-area: y; grid-area: y / y / y / y; display: grid; grid-template-columns: 25% 25% 25% 25%; }',
					':host > div > div[data-base="2"] > button[data-base="2"], :host > div > div[data-base="8"] > button[data-base="8"], :host > div > div[data-base="10"] > button[data-base="10"], :host > div > div[data-base="16"] > button[data-base="16"] { background: #cdcdcd; }',
					':host > div > div > span { display: inline-block; background: #cdcdcd; padding: 0.2rem; margin: 0.2rem; border-radius: 0.2rem; }',
					//':host > div > input[type="text"] { padding-right: 0.7em; }',
				].join('');

				const binary = Common.inputText('Binary:').get();
				binary.addEventListener('input', () => {
					const value = parseInt(binary.value, 2);
					if (Number.isNaN(value)) {
						if (binary.value === '') {
							octal.value = '';
							decimal.value = '';
							hexadecimal.value = '';
						}
						return;
					}
					binary.value = value.toString(2);
					octal.value = value.toString(8);
					decimal.value = value.toString(10);
					hexadecimal.value = value.toString(16);
				});

				const octal = Common.inputText('Octal:').get();
				octal.addEventListener('input', () => {
					const value = parseInt(octal.value, 8);
					if (Number.isNaN(value)) {
						if (octal.value === '') {
							binary.value = '';
							decimal.value = '';
							hexadecimal.value = '';
						}
						return;
					}
					binary.value = value.toString(2);
					octal.value = value.toString(8);
					decimal.value = value.toString(10);
					hexadecimal.value = value.toString(16);
				});

				const decimal = Common.inputNumber('Decimal:').get();
				decimal.addEventListener('input', () => {
					const value = parseInt(decimal.value);
					if (Number.isNaN(value)) {
						if (decimal.value === '') {
							binary.value = '';
							octal.value = '';
							decimal.value = '';
							hexadecimal.value = '';
						}
						return;
					}
					binary.value = value.toString(2);
					octal.value = value.toString(8);
					decimal.value = value.toString(10);
					hexadecimal.value = value.toString(16);
				});

				const hexadecimal = Common.inputText('Hexadecimal:').get();
				hexadecimal.addEventListener('input', () => {
					const value = parseInt(hexadecimal.value, 16);
					if (Number.isNaN(value)) {
						if (hexadecimal.value === '') {
							binary.value = '';
							octal.value = '';
							decimal.value = '';
						}
						return;
					}
					binary.value = value.toString(2);
					octal.value = value.toString(8);
					decimal.value = value.toString(10);
					hexadecimal.value = value.toString(16);
				});

				const add = Common.button('↓', () => {
					if (!decimal.value) {
						return;
					}
					const num = Common.span().get();
					num.textContent = `${decimal.value}`;
					num.dataset.value = parseInt(decimal.value).toString(parseInt(<string> option.dataset.base));
					nums.appendChild(num);
					binary.value = '';
					octal.value = '';
					decimal.value = '';
					hexadecimal.value = '';
				}).get();

				const option = Common.div().get({ class: 'option' });
				option.dataset.base = '10';
				for (const n of [2, 8, 10, 16]) {
					const button = Common.button(`${n}`, () => {
						option.dataset.base = n + '';
						nums.querySelectorAll('span').forEach((num) => {
							num.textContent = parseInt(<string> num.dataset.value).toString(n);
						});
					}).get();
					button.dataset.base = n + '';
					option.appendChild(button);
				}

				const nums = Common.div().get();
				nums.style.gridArea = 'z';

				const contents = document.createElement('div');
				contents.appendChild(binary);
				contents.appendChild(octal);
				contents.appendChild(decimal);
				contents.appendChild(hexadecimal);
				contents.appendChild(add);
				contents.appendChild(option);
				contents.appendChild(nums);

				shadow.appendChild(style);
				shadow.appendChild(contents);

				this.dispatchEvent(new CustomEvent('register'));
			}
		},
	);
});

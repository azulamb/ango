interface MorseNode {
	parent?: MorseNode;
	dot?: MorseNode;
	dash?: MorseNode;
	value: string;
}

interface MorsePreview extends HTMLElement {
	setMorseCode(root: MorseNode): this;
	clear(): this;
	remove(): this;
	dot(): this;
	dash(): this;
	readonly get: boolean[];
	value: string;
	char: string;
}

const Morse = {
	DOT: false,
	DASH: true,
};

((script, init) => {
	if (document.readyState !== 'loading') {
		return init(script);
	}
	document.addEventListener('DOMContentLoaded', () => {
		init(script);
	});
})(<HTMLScriptElement> document.currentScript, (script: HTMLScriptElement) => {
	const tagname = 'morse-preview';
	if (customElements.get(tagname)) {
		return;
	}

	customElements.define(
		tagname,
		class extends HTMLElement implements MorsePreview {
			protected root: MorseNode;
			protected map: { [keys: string]: MorseNode } = {};
			protected inputs: boolean[] = [];
			protected previewDot: HTMLElement;
			protected previewDotMorse: HTMLElement;
			protected previewDash: HTMLElement;
			protected previewDashMorse: HTMLElement;
			protected previewNow: HTMLElement;
			protected previewNowMorse: HTMLElement;

			constructor() {
				super();

				const shadow = this.attachShadow({ mode: 'open' });

				const style = document.createElement('style');
				style.innerHTML = [
					':host { display: block; --size: 1rem; --side: calc(2 * var(--size)); --main: calc(4 * var(--size)); pointer-events: none; }',
					':host > div { display: flex; align-items: center; justify-content: center; gap: calc(0.4 * var(--size)); }',
					':host > div > div { --card: var(--main); width: var(--card); height: calc(1.5 * var(--card)); }',
					':host > div > div:first-child, :host > div > div:last-child { --card: var(--side); }',
					':host > div > div > div { display: grid; grid-template-rows: var(--card) calc(0.5 * var(--card)); border: 1px solid black; text-align: center; border-radius: calc(0.4 * var(--size)); cursor: pointer; pointer-events: auto; user-select: none; overflow: hidden; }',
					':host > div > div > div > div:first-child { font-size: var(--card); line-height: var(--card); }',
					':host > div > div > div > div:last-child { font-size: calc(0.5 * var(--card)); line-height: calc(0.5 * var(--card)); }',
				].join('');

				this.previewDot = document.createElement('div');
				this.previewDotMorse = document.createElement('div');

				this.previewDash = document.createElement('div');
				this.previewDashMorse = document.createElement('div');

				this.previewNow = document.createElement('div');
				this.previewNowMorse = document.createElement('div');

				const dot = document.createElement('div');
				dot.appendChild(this.previewDot);
				dot.appendChild(this.previewDotMorse);
				dot.addEventListener('click', (event) => {
					event.stopPropagation();
					this.dot();
				});

				const dash = document.createElement('div');
				dash.appendChild(this.previewDash);
				dash.appendChild(this.previewDashMorse);
				dash.addEventListener('click', (event) => {
					event.stopPropagation();
					this.dash();
				});

				const now = document.createElement('div');
				now.appendChild(this.previewNow);
				now.appendChild(this.previewNowMorse);
				now.addEventListener('contextmenu', (event) => {
					event.stopPropagation();
					event.preventDefault();
					this.remove();
				});

				const cardPrev = document.createElement('div');
				cardPrev.appendChild(dot);
				const cardDash = document.createElement('div');
				cardDash.appendChild(dash);
				const cardNow = document.createElement('div');
				cardNow.appendChild(now);

				const contents = document.createElement('div');
				contents.appendChild(cardPrev);
				contents.appendChild(cardNow);
				contents.appendChild(cardDash);

				shadow.appendChild(style);
				shadow.appendChild(contents);
			}

			public setMorseCode(root: MorseNode) {
				this.root = root;

				this.map = {};
				const list = [root];
				while (0 < list.length) {
					const item = <MorseNode> list.shift();
					if (item.value && this.map[item.value]) {
						continue;
					}
					if (item.value) {
						this.map[item.value] = item;
					}
					if (item.dot) {
						list.push(item.dot);
					}
					if (item.dash) {
						list.push(item.dash);
					}
				}

				this.update();
				return this;
			}

			public clear() {
				this.inputs = [];
				this.update();
				return this;
			}

			public remove() {
				this.inputs.pop();
				this.update();
				return this;
			}

			public dot() {
				this.inputs.push(Morse.DOT);
				this.update();
				return this;
			}

			public dash() {
				this.inputs.push(Morse.DASH);
				this.update();
				return this;
			}

			get get() {
				return this.inputs.concat();
			}

			get value() {
				return this.toStringMorse(...this.inputs);
			}
			set value(value) {
				this.inputs = (value + '').replace(/[^.-]+/g, '').split('').map((v) => {
					return v === '.' ? Morse.DOT : Morse.DASH;
				});
				this.update();
			}

			get char() {
				return this.previewNow.textContent || '';
			}
			set char(value) {
				if (this.map[value]) {
					const inputs: boolean[] = [];
					let target: MorseNode | undefined = this.map[value];
					while (target) {
						const parent: MorseNode | undefined = target.parent;

						if (parent) {
							inputs.unshift(parent.dot === target ? Morse.DOT : Morse.DASH);
						}

						target = parent;
					}

					this.inputs = inputs;
					this.update();
				}
			}

			protected update() {
				let position = this.root;
				const inputs: boolean[] = [];
				for (const input of this.inputs) {
					const next = position[input === true ? 'dash' : 'dot'];
					if (!next) {
						break;
					}
					inputs.push(input);
					position = next;
				}
				this.inputs = inputs;

				this.previewNow.textContent = position.value;
				this.previewNowMorse.textContent = this.toStringMorse(...this.inputs);

				if (position.dot) {
					this.previewDot.textContent = position.dot.value;
					this.previewDotMorse.textContent = this.toStringMorse(...this.inputs, Morse.DOT);
				} else {
					this.previewDot.textContent = '';
					this.previewDotMorse.textContent = '';
				}

				if (position.dash) {
					this.previewDash.textContent = position.dash.value;
					this.previewDashMorse.textContent = this.toStringMorse(...this.inputs, Morse.DASH);
				} else {
					this.previewDash.textContent = '';
					this.previewDashMorse.textContent = '';
				}
			}

			protected toStringMorse(...inputs: boolean[]) {
				return inputs.map((v) => {
					return v === Morse.DASH ? '-' : '.';
				}).join('');
			}
		},
	);
});

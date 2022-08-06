((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'ango-contents';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        menu;
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
            this.menu = document.createElement('select');
            this.menu.addEventListener('change', () => {
                this.page = this.menu.options[this.menu.selectedIndex].value;
            });
            const header = document.createElement('header');
            header.appendChild(this.menu);
            const contents = document.createElement('div');
            contents.appendChild(document.createElement('slot'));
            const wrapper = document.createElement('div');
            wrapper.appendChild(header);
            wrapper.appendChild(contents);
            shadow.appendChild(style);
            shadow.appendChild(wrapper);
        }
        addContent(tag, name) {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = name;
            if (this.page === tag) {
                option.selected = true;
            }
            this.menu.appendChild(option);
        }
        get page() {
            return this.getAttribute('page') || '';
        }
        set page(value) {
            this.setAttribute('page', value || '');
        }
    });
});
((script, init) => {
    if (document.readyState !== 'loading') {
        return init(script);
    }
    document.addEventListener('DOMContentLoaded', () => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'ascii-code';
    if (customElements.get(tagname)) {
        return;
    }
    function createTd(text) {
        const td = document.createElement('td');
        if (text) {
            td.textContent = text;
        }
        return td;
    }
    customElements.define(tagname, class extends HTMLElement {
        table;
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
                const codes = [];
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
            const text = document.createElement('input');
            text.placeholder = 'Text';
            text.addEventListener('input', () => {
                const value = text.value.replace(/[^ \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/0123456789\:\;\<\=\>\?\@ABCDEFGHIJKLMNOPQRSTUVWXYZ\[\\\]\^\_\`abcdefghijklmnopqrstuvwxyz\{\|\}\~]/g, '');
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
            this.parentElement.addContent(tagname, 'ASCII');
        }
        select(x, y) {
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
    });
});
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
})(document.currentScript, (script) => {
    const tagname = 'morse-preview';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        root;
        map = {};
        inputs = [];
        previewDot;
        previewDotMorse;
        previewDash;
        previewDashMorse;
        previewNow;
        previewNowMorse;
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; --size: 1rem; --side: calc(2 * var(--size)); --main: calc(4 * var(--size)); pointer-events: none; }',
                ':host > div { display: flex; align-items: center; justify-content: center; gap: calc(0.4 * var(--size)); }',
                ':host > div > div { --card: var(--main); width: var(--card); height: calc(1.5 * var(--card)); }',
                ':host > div > div:first-child, :host > div > div:last-child { --card: var(--side); }',
                ':host > div > div > div { display: grid; grid-template-rows: var(--card) calc(0.5 * var(--card)); border: 1px solid black; text-align: center; border-radius: calc(0.4 * var(--size)); cursor: pointer; pointer-events: auto; user-select: none; }',
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
        setMorseCode(root) {
            this.root = root;
            this.map = {};
            const list = [root];
            while (0 < list.length) {
                const item = list.shift();
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
        clear() {
            this.inputs = [];
            this.update();
            return this;
        }
        remove() {
            this.inputs.pop();
            this.update();
            return this;
        }
        dot() {
            this.inputs.push(Morse.DOT);
            this.update();
            return this;
        }
        dash() {
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
                const inputs = [];
                let target = this.map[value];
                while (target) {
                    const parent = target.parent;
                    if (parent) {
                        inputs.unshift(parent.dot === target ? Morse.DOT : Morse.DASH);
                    }
                    target = parent;
                }
                this.inputs = inputs;
                this.update();
            }
        }
        update() {
            let position = this.root;
            const inputs = [];
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
            }
            else {
                this.previewDot.textContent = '';
                this.previewDotMorse.textContent = '';
            }
            if (position.dash) {
                this.previewDash.textContent = position.dash.value;
                this.previewDashMorse.textContent = this.toStringMorse(...this.inputs, Morse.DASH);
            }
            else {
                this.previewDash.textContent = '';
                this.previewDashMorse.textContent = '';
            }
        }
        toStringMorse(...inputs) {
            return inputs.map((v) => {
                return v === Morse.DASH ? '-' : '.';
            }).join('');
        }
    });
});
((script, init) => {
    customElements.whenDefined('morse-preview').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'morse-code';
    if (customElements.get(tagname)) {
        return;
    }
    const SVG = {
        create: (width, height) => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttributeNS(null, 'width', `${width}px`);
            svg.setAttributeNS(null, 'height', `${height}px`);
            svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
            return svg;
        },
        path: (d, option) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', d);
            if (option) {
                if (option.id) {
                    path.id = option.id;
                }
                if (option.class) {
                    path.classList.add(option.class);
                }
            }
            return path;
        },
        circle: (cx, cy, option) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttributeNS(null, 'cx', cx + '');
            circle.setAttributeNS(null, 'cy', cy + '');
            circle.setAttributeNS(null, 'r', '3');
            if (option) {
                if (option.id) {
                    circle.id = option.id;
                }
                if (option.class) {
                    circle.classList.add(option.class);
                }
            }
            return circle;
        },
        g: () => {
            return document.createElementNS('http://www.w3.org/2000/svg', 'g');
        },
    };
    customElements.define(tagname, class MorseCode extends HTMLElement {
        root;
        svg;
        morse;
        text;
        preview;
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; }',
                `:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
                ':host > div { display: block; width: 100%; min-height: 100%; padding-bottom: 25vmin; box-sizing: border-box; height: calc(100vh - var(--header)); display: grid; grid-template-rows: 1fr 3rem 3rem 20vh; }',
                'div.input { width: 100vmin; height: 25vmin; display: grid; grid-template-columns: 25vmin 25vmin 25vmin 25vmin; grid-template-rows: 25vmin; position: absolute; bottom: 0; left: 0; right: 0; margin: auto; overflow: hidden; }',
                'div.input > button { font-size: 20vmin; padding: 0; line-height: 20vmin; }',
                'svg { --dot: #2f48b7; --dash: #a731dd; --frame: #333; --char: #fff; width: 100%; height: 100%; }',
                'svg .selected { --dot: #d39e32; --dash: #d39e32; --frame: #9d7b36; }',
                'svg path.dot { stroke: var(--dot); }',
                'svg path.dash { stroke: var(--dash); }',
                'svg path.frame, svg circle.frame { fill: var(--frame); cursor: pointer; }',
                'svg path.char { fill: var(--char); pointer-events: none; }',
                'morse-preview { --size: 3vh; }',
                'input[type="text"] { font-size: 3rem; width: 100%; box-sizing: border-box; }',
            ].join('');
            const codes = this.createSVG();
            this.root = this.createTree(codes);
            this.preview = new (customElements.get('morse-preview'))();
            this.preview.setMorseCode(this.root);
            this.preview.addEventListener('click', () => {
                this.addChar(this.preview.char);
            });
            const preview = document.createElement('div');
            preview.appendChild(this.preview);
            const remove = document.createElement('button');
            remove.textContent = '⇦';
            remove.addEventListener('click', () => {
                this.preview.remove();
                this.updateMorse();
            });
            const dot = document.createElement('button');
            dot.textContent = '・';
            dot.addEventListener('click', () => {
                this.preview.dot();
                this.updateMorse();
            });
            const dash = document.createElement('button');
            dash.textContent = '－';
            dash.addEventListener('click', () => {
                this.preview.dash();
                this.updateMorse();
            });
            const enter = document.createElement('button');
            enter.addEventListener('click', () => {
                this.addChar(this.preview.char);
            });
            enter.textContent = '↴';
            const inputs = document.createElement('div');
            inputs.classList.add('input');
            inputs.appendChild(remove);
            inputs.appendChild(dot);
            inputs.appendChild(dash);
            inputs.appendChild(enter);
            this.morse = document.createElement('input');
            this.morse.type = 'text';
            this.morse.placeholder = 'Morse code. (. -)';
            this.morse.addEventListener('input', () => {
                this.morse.value = this.morse.value
                    .replace(/\s+/g, ' ')
                    .replace(/[^.-\s]+/g, '')
                    .replace(/^\s+/g, '');
                this.changeFromMorse();
            });
            this.text = document.createElement('input');
            this.text.type = 'text';
            this.text.placeholder = 'Text.';
            this.text.addEventListener('input', () => {
                this.changeFromText();
            });
            const contents = document.createElement('div');
            contents.appendChild(this.svg);
            contents.appendChild(this.morse);
            contents.appendChild(this.text);
            contents.appendChild(preview);
            contents.appendChild(inputs);
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.parentElement.addContent(tagname, 'Morse');
        }
        changeFromMorse() {
            this.text.value = this.morse.value.split(' ').map((morse) => {
                this.preview.value = morse;
                return this.preview.char;
            }).join('');
            this.preview.clear();
        }
        changeFromText() {
            this.morse.value = this.text.value.split('').map((char) => {
                this.preview.char = char;
                return this.preview.value;
            }).filter((v) => {
                return !!v;
            }).join(' ');
            this.preview.clear();
        }
        addChar(char) {
            this.text.value += char;
            this.changeFromText();
            this.updateMorse();
        }
        updateMorse() {
            for (const element of this.svg.querySelectorAll('.selected')) {
                element.classList.remove('selected');
            }
            let position = this.root;
            const inputs = this.preview.get;
            for (const input of inputs) {
                const next = position[input === true ? 'dash' : 'dot'];
                if (!next) {
                    break;
                }
                position = next;
                if (position.route) {
                    position.route.classList.add('selected');
                    position.frame.classList.add('selected');
                }
            }
        }
        createTree(codes) {
            function connect(parent, dot, dash) {
                if (typeof parent === 'string') {
                    if (codes[dot]) {
                        codes[parent].dot = codes[dot];
                        codes[dot].parent = codes[parent];
                    }
                    if (codes[dash]) {
                        codes[parent].dash = codes[dash];
                        codes[dash].parent = codes[parent];
                    }
                }
                else {
                    if (codes[dot]) {
                        parent.dot = codes[dot];
                        codes[dot].parent = parent;
                    }
                    if (codes[dash]) {
                        parent.dash = codes[dash];
                        codes[dash].parent = parent;
                    }
                }
            }
            connect('h', '5', '4');
            connect('v', '', '3');
            connect('_1', '', '2');
            connect('j', '', '1');
            connect('b', '6', '');
            connect('z', '7', '');
            connect('_2', '8', '');
            connect('_3', '9', '0');
            connect('s', 'h', 'v');
            connect('u', 'f', '_1');
            connect('r', 'l', '');
            connect('w', 'p', 'j');
            connect('d', 'b', 'x');
            connect('k', 'c', 'y');
            connect('g', 'z', 'q');
            connect('o', '_2', '_3');
            connect('i', 's', 'u');
            connect('a', 'r', 'w');
            connect('n', 'd', 'k');
            connect('m', 'g', 'o');
            connect('e', 'i', 'a');
            connect('t', 'n', 'm');
            const root = {
                dot: codes.e,
                dash: codes.t,
                value: '',
                route: null,
                frame: null,
            };
            connect(root, 'e', 't');
            return root;
        }
        createSVG() {
            const codes = {};
            const routes = SVG.g();
            const frames = SVG.g();
            [
                {
                    key: '5',
                    route: 'm13 4h-9',
                    cx: 4,
                    cy: 4,
                    char: 'm3 1.5a0.50005 0.50005 0 0 0-0.5 0.5v1.5a0.50005 0.50005 0 0 0 0.5 0.5h1.5v1c0 0.27857-0.056214 0.37262-0.091797 0.4082-0.035583 0.035583-0.12963 0.091797-0.4082 0.091797s-0.37262-0.056214-0.4082-0.091797c-0.035583-0.035583-0.091797-0.12963-0.091797-0.4082a0.5 0.5 0 0 0-0.5-0.5 0.5 0.5 0 0 0-0.5 0.5c0 0.42143 0.095349 0.82582 0.38477 1.1152 0.28942 0.28942 0.69381 0.38477 1.1152 0.38477s0.82582-0.095349 1.1152-0.38477 0.38477-0.69381 0.38477-1.1152v-1.5a0.50005 0.50005 0 0 0-0.5-0.5h-1.5v-0.5h1.5a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: '6',
                    route: 'm51 4h9',
                    cx: 60,
                    cy: 4,
                    char: 'm60.5 1.5c-0.50278 0-0.94232 0.2177-1.2324 0.5293s-0.45333 0.69344-0.56055 1.0723c-0.21443 0.75764-0.20703 1.5484-0.20703 1.8984 0 0.42143 0.09535 0.82582 0.38477 1.1152s0.69381 0.38477 1.1152 0.38477 0.82582-0.095349 1.1152-0.38477c0.28942-0.28942 0.38477-0.69381 0.38477-1.1152 0-0.42143-0.09535-0.82582-0.38477-1.1152-0.28942-0.28942-0.69381-0.38477-1.1152-0.38477-0.13503 0-0.229 0.10034-0.35742 0.12305 0.01799-0.092036 7.21e-4 -0.16283 0.02539-0.25 0.08029-0.28368 0.19831-0.52058 0.33008-0.66211s0.25473-0.21094 0.50195-0.21094c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5zm-0.5 3c0.27857 0 0.37262 0.056214 0.4082 0.091797s0.0918 0.12963 0.0918 0.4082-0.05621 0.37262-0.0918 0.4082c-0.03558 0.035583-0.12963 0.091797-0.4082 0.091797s-0.37262-0.056214-0.4082-0.091797c-0.035586-0.035583-0.0918-0.12963-0.0918-0.4082s0.05621-0.37262 0.0918-0.4082c0.03558-0.035583 0.12963-0.091797 0.4082-0.091797z',
                },
                {
                    key: '7',
                    route: 'm60 36h-9',
                    cx: 60,
                    cy: 36,
                    char: 'm59 33.5a0.5 0.5 0 0 0-0.5 0.5 0.5 0.5 0 0 0 0.5 0.5h1.3594l-0.84375 3.3789a0.5 0.5 0 0 0 0.36328 0.60547 0.5 0.5 0 0 0 0.60547-0.36328l1-4a0.50005 0.50005 0 0 0-0.48438-0.62109z',
                },
                {
                    key: '8',
                    route: 'm51 52 9-8',
                    cx: 60,
                    cy: 44,
                    char: 'm60 41.525c-0.35833 0-0.72423 0.1127-1.0156 0.36523s-0.48438 0.65617-0.48438 1.1094c0 0.4131 0.25126 0.68058 0.48242 0.88477 0.04976 0.04395 0.10776 0.0743 0.16016 0.11523-0.0524 0.04094-0.1104 0.07128-0.16016 0.11523-0.23116 0.20419-0.48242 0.47167-0.48242 0.88477 0 0.4532 0.19298 0.85684 0.48438 1.1094s0.65729 0.36523 1.0156 0.36523 0.72423-0.1127 1.0156-0.36523 0.48438-0.65617 0.48438-1.1094c0-0.4131-0.25126-0.68058-0.48242-0.88477-0.04976-0.04395-0.10776-0.0743-0.16016-0.11523 0.0524-0.04094 0.1104-0.07128 0.16016-0.11523 0.23116-0.20419 0.48242-0.47167 0.48242-0.88477 0-0.4532-0.19298-0.85684-0.48438-1.1094s-0.65729-0.36523-1.0156-0.36523zm0 1c0.14167 0 0.27577 0.04863 0.35938 0.12109s0.14062 0.15672 0.14062 0.35352c0-0.06309 0.0013 0.0077-0.14258 0.13477-0.08146 0.07196-0.23129 0.16535-0.35742 0.25195-0.12613-0.0866-0.27596-0.18-0.35742-0.25195-0.14384-0.12706-0.14258-0.19786-0.14258-0.13477 0-0.1968 0.05702-0.28106 0.14062-0.35352 0.08361-0.07246 0.21771-0.12109 0.35938-0.12109zm0 2.0879c0.12613 0.0866 0.27596 0.18 0.35742 0.25195 0.14384 0.12706 0.14258 0.19786 0.14258 0.13477 0 0.1968-0.05702 0.28106-0.14062 0.35352-0.08361 0.07246-0.21771 0.12109-0.35938 0.12109s-0.27577-0.04863-0.35938-0.12109c-0.083609-0.072461-0.14062-0.15672-0.14062-0.35352 0 0.06309-0.0013-0.0077 0.14258-0.13477 0.08146-0.07196 0.23129-0.16535 0.35742-0.25195z',
                },
                {
                    key: '9',
                    route: 'm51 60 9-8',
                    cx: 60,
                    cy: 52,
                    char: 'm60 49.5c-0.42143 0-0.82582 0.09535-1.1152 0.38477-0.28942 0.28941-0.38477 0.69381-0.38477 1.1152s0.09535 0.82582 0.38477 1.1152c0.28941 0.28942 0.69381 0.38477 1.1152 0.38477 0.14627 0 0.28967-0.01196 0.42773-0.03906-0.0045 0.1762-0.01243 0.34471-0.03711 0.44336-0.09932 0.39728-0.18161 0.51112-0.53516 0.61719-0.26423 0.07988-0.41373 0.35878-0.33398 0.62305 0.07988 0.26423 0.35878 0.41373 0.62305 0.33398 0.64646-0.19394 1.0642-0.72931 1.2148-1.332 0.15068-0.60272 0.14062-1.2965 0.14062-2.1465 0-0.42143-0.09535-0.82582-0.38477-1.1152-0.0089-0.0089-0.01825-0.01687-0.02734-0.02539-0.28728-0.26908-0.6794-0.35938-1.0879-0.35938zm-0.05078 1c0.016-4.2e-4 0.03337 0 0.05078 0 0.27857 0 0.37262 0.05621 0.4082 0.0918 0.03558 0.03558 0.0918 0.12963 0.0918 0.4082s-0.05621 0.37262-0.0918 0.4082c-0.03558 0.03558-0.12963 0.0918-0.4082 0.0918s-0.37262-0.05621-0.4082-0.0918c-0.03558-0.03558-0.0918-0.12963-0.0918-0.4082s0.05621-0.37262 0.0918-0.4082c0.03336-0.03336 0.11742-0.08549 0.35742-0.0918z',
                },
                {
                    key: 'b',
                    route: 'm44 8 7-4',
                    cx: 51,
                    cy: 4,
                    char: 'm50 1.5c-0.27613 2.76e-5 -0.49997 0.22387-0.5 0.5v4c2.8e-5 0.27613 0.22387 0.49997 0.5 0.5h1.1992c1.0852 0 1.8516-0.7 1.8516-1.5 0-0.38063-0.19575-0.72927-0.49414-1 0.29839-0.27073 0.49414-0.61937 0.49414-1 0-0.8-0.76638-1.5-1.8516-1.5zm0.5 1h0.69922c0.71481 0 0.85156 0.3 0.85156 0.5 0 0.1975-0.13448 0.49266-0.82617 0.5-0.0087 9.28e-5 -0.01646 0-0.02539 0-0.2805 1.262e-4 -0.50781 0.22395-0.50781 0.5s0.22732 0.49987 0.50781 0.5c0.71481 0 0.85156 0.3 0.85156 0.5s-0.13675 0.5-0.85156 0.5h-0.69922z',
                },
                {
                    key: 'c',
                    route: 'm51 20-7 4',
                    cx: 51,
                    cy: 20,
                    char: 'm51 17.525c-0.35833 0-0.72423 0.1127-1.0156 0.36523s-0.48438 0.65617-0.48438 1.1094v2c0 0.4532 0.19298 0.85684 0.48438 1.1094s0.65729 0.36523 1.0156 0.36523 0.72423-0.1127 1.0156-0.36523 0.48438-0.65617 0.48438-1.1094c0-0.27614-0.22386-0.5-0.5-0.5s-0.5 0.22386-0.5 0.5c0 0.1968-0.05702 0.28106-0.14062 0.35352-0.08361 0.07246-0.21771 0.12109-0.35938 0.12109s-0.27577-0.04863-0.35938-0.12109-0.14062-0.15672-0.14062-0.35352v-2c0-0.1968 0.05702-0.28106 0.14062-0.35352 0.08361-0.07246 0.21771-0.12109 0.35938-0.12109s0.27577 0.04863 0.35938 0.12109 0.14062 0.15672 0.14062 0.35352c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5c0-0.4532-0.19298-0.85684-0.48438-1.1094s-0.65729-0.36523-1.0156-0.36523z',
                },
                {
                    key: 'd',
                    route: 'm44 8-5 8',
                    cx: 44,
                    cy: 8,
                    char: 'm43 5.5c-0.27613 2.76e-5 -0.49997 0.22387-0.5 0.5v4c2.8e-5 0.27613 0.22387 0.49997 0.5 0.5h1.1992c0.63518 0 1.1534-0.3871 1.4414-0.86719 0.28805-0.48008 0.41016-1.0578 0.41016-1.6328s-0.1221-1.1527-0.41016-1.6328-0.80622-0.86719-1.4414-0.86719zm0.5 1h0.69922c0.26481 0 0.42204 0.1129 0.58398 0.38281s0.26758 0.69219 0.26758 1.1172-0.10563 0.84727-0.26758 1.1172-0.31917 0.38281-0.58398 0.38281h-0.69922z',
                },
                {
                    key: 'e',
                    route: 'm32 32h-7',
                    cx: 25,
                    cy: 32,
                    char: 'm24 29.5a0.50005 0.50005 0 0 0-0.5 0.5v4a0.50005 0.50005 0 0 0 0.5 0.5h2a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5h-1.5v-0.98828h1.0723c0.28268 1.62e-4 0.51188-0.22904 0.51172-0.51172 1.63e-4 -0.28268-0.22904-0.51188-0.51172-0.51172h-1.0723v-0.98828h1.5a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: 'f',
                    route: 'm20 24-7-4',
                    cx: 13,
                    cy: 20,
                    char: 'm12 17.5c-0.27613 2.8e-5 -0.49997 0.22387-0.5 0.5v4c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-1.5h1c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5h-1v-1h1.5c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5z',
                },
                {
                    key: 'g',
                    route: 'm39 48 5-8',
                    cx: 44,
                    cy: 40,
                    char: 'm44 37.525c-0.39028 0-0.7853 0.0982-1.1172 0.33789-0.33188 0.2397-0.58203 0.65787-0.58203 1.1367v2c0 0.47885 0.25015 0.89702 0.58203 1.1367 0.33188 0.23969 0.72691 0.33789 1.1172 0.33789 0.2754 0 0.55232-0.0491 0.80859-0.16211a0.5 0.5 0 0 0 0.39062 0.1875 0.5 0.5 0 0 0 0.5-0.5v-1.5996a0.50005 0.50005 0 0 0-0.5-0.5h-1a0.5 0.5 0 0 0-0.5 0.5 0.5 0.5 0 0 0 0.5 0.5h0.5v0.09961c0 0.17115-0.0479 0.24087-0.16602 0.32617s-0.32348 0.14844-0.5332 0.14844-0.41509-0.06313-0.5332-0.14844c-0.11812-0.08531-0.16602-0.15502-0.16602-0.32617v-2c0-0.17115 0.0479-0.24087 0.16602-0.32617s0.32348-0.14844 0.5332-0.14844 0.41509 0.06313 0.5332 0.14844c0.11812 0.08531 0.16602 0.15502 0.16602 0.32617a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5c0-0.47885-0.25015-0.89702-0.58203-1.1367-0.33188-0.23969-0.72691-0.33789-1.1172-0.33789z',
                },
                {
                    key: 'h',
                    route: 'm20 8-7-4',
                    cx: 13,
                    cy: 4,
                    char: 'm12 1.5c-0.27614 0-0.5 0.22386-0.5 0.5v4c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-1.5h1v1.5c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-4c0-0.27614-0.22386-0.5-0.5-0.5s-0.5 0.22386-0.5 0.5v1.5h-1v-1.5c0-0.27614-0.22386-0.5-0.5-0.5z',
                },
                {
                    key: 'i',
                    route: 'm25 32v-16',
                    cx: 25,
                    cy: 16,
                    char: 'm24 13.5a0.5 0.5 0 0 0-0.5 0.5 0.5 0.5 0 0 0 0.5 0.5h0.5v3h-0.5a0.5 0.5 0 0 0-0.5 0.5 0.5 0.5 0 0 0 0.5 0.5h2a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5h-0.5v-3h0.5a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: 'l',
                    route: 'm20 40-7-4',
                    cx: 13,
                    cy: 36,
                    char: 'm12 33.5a0.5 0.5 0 0 0-0.5 0.5v4a0.50005 0.50005 0 0 0 0.5 0.5h2a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5h-1.5v-3.5a0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: 'n',
                    route: 'm39 32v-16',
                    cx: 39,
                    cy: 16,
                    char: 'm40 13.5a0.5 0.5 0 0 0-0.5 0.5v1.8828l-1.0527-2.1055a0.50005 0.50005 0 0 0-0.94727 0.22266v4a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5v-1.8828l1.0527 2.1055a0.50005 0.50005 0 0 0 0.94727-0.22266v-4a0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: 'p',
                    route: 'm20 56-7-4',
                    cx: 13,
                    cy: 52,
                    char: 'm12 49.5c-0.27613 2.8e-5 -0.49997 0.22387-0.5 0.5v4c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-1.4004h0.5c0.45962 0 0.86788-0.20772 1.1172-0.50976 0.24931-0.30205 0.35742-0.67339 0.35742-1.0391s-0.10811-0.73897-0.35742-1.041c-0.24931-0.30205-0.65757-0.50977-1.1172-0.50977zm0.5 1h0.5c0.19038 0 0.27001 0.05478 0.3457 0.14648s0.12891 0.24497 0.12891 0.4043-0.05321 0.31064-0.12891 0.40234c-0.07569 0.0917-0.15532 0.14648-0.3457 0.14648h-0.5z',
                },
                {
                    key: 'r',
                    route: 'm25 48-5-8',
                    cx: 20,
                    cy: 40,
                    char: 'm19 37.5a0.50005 0.50005 0 0 0-0.5 0.5v4a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5v-0.73633l1.1562 1.0996a0.5 0.5 0 0 0 0.70703-0.01953 0.5 0.5 0 0 0-0.01953-0.70703l-1.1738-1.1152c0.37417-0.05142 0.73593-0.1756 0.94726-0.43164 0.24931-0.30205 0.35742-0.67339 0.35742-1.0391s-0.10811-0.73897-0.35742-1.041c-0.24931-0.30205-0.65757-0.50977-1.1172-0.50977zm0.5 1h0.5c0.19038 0 0.27001 0.05478 0.3457 0.14648s0.12891 0.24497 0.12891 0.4043-0.05322 0.31064-0.12891 0.40234-0.15532 0.14648-0.3457 0.14648h-0.5z',
                },
                {
                    key: 's',
                    route: 'm25 16-5-8',
                    cx: 20,
                    cy: 8,
                    char: 'm20.586 5.4316c-0.4731-0.16446-0.98045-0.12598-1.4199 0.076172-0.21974 0.10108-0.42657 0.25085-0.57812 0.46875-0.15156 0.2179-0.23269 0.51237-0.19336 0.80469 0.07865 0.58464 0.51946 1.0957 1.3281 1.6348 0.69133 0.46089 0.87553 0.82527 0.89062 0.9375 0.0075 0.056115 0.0027 0.064779-0.02148 0.099609-0.02423 0.034831-0.08302 0.088188-0.17578 0.13086-0.18553 0.085343-0.49068 0.10273-0.67383 0.039063-0.18315-0.063666-0.24219-0.093344-0.24219-0.32227a0.5 0.5 0 0 0-0.5-0.5 0.5 0.5 0 0 0-0.5 0.5c0 0.62108 0.44096 1.1031 0.91406 1.2676 0.4731 0.16446 0.98045 0.12598 1.4199-0.07617 0.21974-0.10108 0.42657-0.25085 0.57812-0.46875 0.15156-0.2179 0.23269-0.51237 0.19336-0.80469-0.07865-0.58464-0.51946-1.0957-1.3281-1.6348-0.69133-0.46089-0.87553-0.82527-0.89062-0.9375-0.0075-0.056115-0.0027-0.064779 0.02148-0.099609 0.02423-0.034831 0.08302-0.088188 0.17578-0.13086 0.18553-0.085343 0.49068-0.10273 0.67383-0.039063 0.18315 0.063665 0.24219 0.093343 0.24219 0.32226a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5c0-0.62108-0.44096-1.1031-0.91406-1.2676z',
                },
                {
                    key: 'z',
                    route: 'm44 40 7-4',
                    cx: 51,
                    cy: 36,
                    char: 'm50 33.5a0.5 0.5 0 0 0-0.5 0.5 0.5 0.5 0 0 0 0.5 0.5h1.1914l-1.6387 3.2773a0.50005 0.50005 0 0 0 0.44727 0.72266h2a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5h-1.1914l1.6387-3.2773a0.50005 0.50005 0 0 0-0.44727-0.72266z',
                },
                { key: '_2', route: 'm44 56 7-4', cx: 51, cy: 52, char: '' },
            ].forEach((data) => {
                const route = SVG.path(data.route, { class: 'dot' });
                routes.appendChild(route);
                const frame = SVG.circle(data.cx, data.cy, { class: 'frame' });
                frames.appendChild(frame);
                if (!data.key.includes('_')) {
                    frame.addEventListener('click', () => {
                        this.addChar(data.key);
                    });
                }
                if (data.char) {
                    const char = SVG.path(data.char, { class: 'char' });
                    frames.appendChild(char);
                }
                if (data.key.includes('_')) {
                    route.id = `route_e${data.key}`;
                    frame.id = `frame_e${data.key}`;
                }
                else {
                    route.id = `route_${data.key}`;
                    frame.id = `frame_${data.key}`;
                }
                codes[data.key] = {
                    value: data.key.includes('_') ? '' : data.key,
                    route: route,
                    frame: frame,
                };
            });
            [
                {
                    key: '0',
                    route: 'm51 60h9',
                    frame: 'm59 57c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm60 57.525c-0.35833 0-0.72423 0.1127-1.0156 0.36523s-0.48438 0.65617-0.48438 1.1094v2c0 0.4532 0.19298 0.85684 0.48438 1.1094s0.65729 0.36523 1.0156 0.36523 0.72423-0.1127 1.0156-0.36523 0.48438-0.65617 0.48438-1.1094v-2c0-0.4532-0.19298-0.85684-0.48438-1.1094s-0.65729-0.36523-1.0156-0.36523zm0 1c0.14167 0 0.27577 0.04863 0.35938 0.12109 0.05127 0.04444 0.09293 0.09337 0.11719 0.16992l-0.97656 0.97656v-0.79297c0-0.1968 0.05702-0.28106 0.14062-0.35352 0.08361-0.07246 0.21771-0.12109 0.35938-0.12109zm0.5 1.6816v0.79297c0 0.1968-0.05702 0.28106-0.14062 0.35352-0.08361 0.07246-0.21771 0.12109-0.35938 0.12109s-0.27577-0.04863-0.35938-0.12109c-0.05127-0.04444-0.09293-0.09337-0.11719-0.16992l0.97656-0.97656z',
                },
                {
                    key: '1',
                    route: 'm13 60h-9',
                    frame: 'm3 57c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm4.1914 57.539a0.50005 0.50005 0 0 0-0.54492 0.10742l-1 1a0.5 0.5 0 0 0 0 0.70703 0.5 0.5 0 0 0 0.70703 0l0.14648-0.14648v2.793a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5v-4a0.50005 0.50005 0 0 0-0.30859-0.46094z',
                },
                {
                    key: '2',
                    route: 'm13 28h-9',
                    frame: 'm3 25c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm4 25.574c-0.75 0-1.5 0.65278-1.5 1.625a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5c0-0.52778 0.25-0.625 0.5-0.625s0.5 0.09722 0.5 0.625c0 0.28592-0.16921 0.63962-0.51172 1.0586s-0.83413 0.881-1.3418 1.3887a0.50005 0.50005 0 0 0 0.35352 0.85352h2a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5h-0.82422c0.19626-0.20183 0.41629-0.40184 0.58594-0.60938 0.40749-0.49847 0.73828-1.0471 0.73828-1.6914 0-0.97222-0.75-1.625-1.5-1.625z',
                },
                {
                    key: '3',
                    route: 'm13 12-9 8',
                    frame: 'm3 17c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm3.9746 17.451c-0.73246 0.036623-1.4746 0.64242-1.4746 1.5488a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5c0-0.39359 0.25785-0.5374 0.52539-0.55078 0.13377-0.0067 0.2465 0.03228 0.32422 0.10352 0.077715 0.071239 0.15039 0.18338 0.15039 0.44727 0 0.08333-0.057083 0.22505-0.16602 0.33398-0.10893 0.10893-0.25065 0.16602-0.33398 0.16602a0.50005 0.50005 0 0 0 0 1c0.083333 0 0.22505 0.05708 0.33398 0.16602 0.10893 0.10893 0.16602 0.25065 0.16602 0.33398 0 0.26389-0.072676 0.37603-0.15039 0.44727-0.077715 0.071238-0.19045 0.1102-0.32422 0.10352-0.26754-0.013377-0.52539-0.15719-0.52539-0.55078a0.5 0.5 0 0 0-0.5-0.5 0.5 0.5 0 0 0-0.5 0.5c0 0.90641 0.74215 1.5122 1.4746 1.5488 0.36623 0.01831 0.7535-0.09272 1.0508-0.36523 0.29728-0.27251 0.47461-0.69748 0.47461-1.1836 0-0.40032-0.19147-0.73747-0.44141-1 0.24994-0.26253 0.44141-0.59968 0.44141-1 0-0.48611-0.17732-0.91108-0.47461-1.1836-0.29728-0.27251-0.68455-0.38355-1.0508-0.36523z',
                },
                {
                    key: '4',
                    route: 'm13 4-9 8',
                    frame: 'm3 9c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm3.5293 9.5a0.5 0.5 0 0 0-0.50391 0.3418l-1 3a0.50005 0.50005 0 0 0 0.47461 0.6582h1.5v0.5a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5v-0.5h0.5a0.5 0.5 0 0 0 0.5-0.5 0.5 0.5 0 0 0-0.5-0.5h-0.5v-1.5a0.5 0.5 0 0 0-0.5-0.5 0.5 0.5 0 0 0-0.5 0.5v1.5h-0.80664l0.78125-2.3418a0.5 0.5 0 0 0-0.31641-0.63281 0.5 0.5 0 0 0-0.12891-0.025391z',
                },
                {
                    key: 'a',
                    route: 'm25 32v16',
                    frame: 'm24 45c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm25 45.475c-0.75 0-1.5 0.65278-1.5 1.625v2.9004a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5v-0.5h1v0.5a0.5 0.5 0 0 0 0.5 0.5 0.5 0.5 0 0 0 0.5-0.5v-2.9004c0-0.97222-0.75-1.625-1.5-1.625zm0 1c0.25 0 0.5 0.09722 0.5 0.625v1.4004h-1v-1.4004c0-0.52778 0.25-0.625 0.5-0.625z',
                },
                {
                    key: 'j',
                    route: 'm20 56-7 4',
                    frame: 'm12 57c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm14 57.5a0.5 0.5 0 0 0-0.5 0.5v3c0 0.1968-0.05702 0.28106-0.14062 0.35352-0.08361 0.07246-0.21771 0.12109-0.35938 0.12109s-0.27577-0.04863-0.35938-0.12109c-0.083609-0.072461-0.14062-0.15672-0.14062-0.35352a0.5 0.5 0 0 0-0.5-0.5 0.5 0.5 0 0 0-0.5 0.5c0 0.4532 0.19298 0.85684 0.48438 1.1094s0.65729 0.36523 1.0156 0.36523 0.72423-0.1127 1.0156-0.36523 0.48438-0.65617 0.48438-1.1094v-3a0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: 'k',
                    route: 'm39 16 5 8',
                    frame: 'm43 21c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm43 21.5c-0.27614 0-0.5 0.22386-0.5 0.5v4c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-0.79297l1.1465 1.1465c0.19525 0.19521 0.51178 0.19521 0.70703 0 0.19521-0.19525 0.19521-0.51178 0-0.70703l-1.6465-1.6465 1.6465-1.6465c0.19521-0.19525 0.19521-0.51178 0-0.70703-0.09375-0.09377-0.22092-0.14646-0.35352-0.14648-0.1326 2e-5 -0.25976 0.05271-0.35352 0.14648l-1.1465 1.1465v-0.79297c0-0.27614-0.22386-0.5-0.5-0.5z',
                },
                {
                    key: 'm',
                    route: 'm39 32v16',
                    frame: 'm38 45c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm37.98 45.5a0.50005 0.50005 0 0 0-0.46484 0.37891l-1 4a0.5 0.5 0 0 0 0.36328 0.60547 0.5 0.5 0 0 0 0.60547-0.36328l0.58398-2.334 0.45703 1.3711a0.50005 0.50005 0 0 0 0.94922 0l0.45703-1.3711 0.58398 2.334a0.5 0.5 0 0 0 0.60547 0.36328 0.5 0.5 0 0 0 0.36328-0.60547l-1-4a0.50005 0.50005 0 0 0-0.95898-0.03711l-0.52539 1.5762-0.52539-1.5762a0.50005 0.50005 0 0 0-0.49414-0.3418z',
                },
                {
                    key: 'o',
                    route: 'm44 56-5-8',
                    frame: 'm43 53c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm44 53.525c-0.35833 0-0.72423 0.1127-1.0156 0.36523s-0.48438 0.65617-0.48438 1.1094v2c0 0.4532 0.19298 0.85684 0.48438 1.1094s0.65729 0.36523 1.0156 0.36523 0.72423-0.1127 1.0156-0.36523 0.48438-0.65617 0.48438-1.1094v-2c0-0.4532-0.19298-0.85684-0.48438-1.1094s-0.65729-0.36523-1.0156-0.36523zm0 1c0.14167 0 0.27577 0.04863 0.35938 0.12109s0.14062 0.15672 0.14062 0.35352v2c0 0.1968-0.05702 0.28106-0.14062 0.35352-0.08361 0.07246-0.21771 0.12109-0.35938 0.12109s-0.27577-0.04863-0.35938-0.12109c-0.083609-0.072461-0.14062-0.15672-0.14062-0.35352v-2c0-0.1968 0.05702-0.28106 0.14062-0.35352 0.08361-0.07246 0.21771-0.12109 0.35938-0.12109z',
                },
                {
                    key: 'q',
                    route: 'm51 44-7-4',
                    frame: 'm50 41c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm51 41.525c-0.39028 0-0.7853 0.0982-1.1172 0.33789-0.33188 0.2397-0.58203 0.65787-0.58203 1.1367v2c0 0.47885 0.25015 0.89702 0.58203 1.1367 0.33188 0.23969 0.72691 0.33789 1.1172 0.33789s0.7853-0.0982 1.1172-0.33789c0.05895-0.04257 0.11512-0.09136 0.16797-0.14453l0.16211 0.16211a0.5 0.5 0 0 0 0.70703 0 0.5 0.5 0 0 0 0-0.70703l-0.45508-0.45508v-1.9922c0-0.47885-0.25015-0.89702-0.58203-1.1367-0.33188-0.23969-0.72691-0.33789-1.1172-0.33789zm0 1c0.20972 0 0.41509 0.06313 0.5332 0.14844 0.11812 0.08531 0.16602 0.15502 0.16602 0.32617v1.002a0.5 0.5 0 0 0-0.29883-0.10156 0.5 0.5 0 0 0-0.35352 0.14648 0.5 0.5 0 0 0 0 0.70703l0.53516 0.53516c-0.0147 0.01256-0.03101 0.02424-0.04883 0.03711-0.11812 0.0853-0.32348 0.14844-0.5332 0.14844s-0.41509-0.06313-0.5332-0.14844c-0.11812-0.08531-0.16602-0.15502-0.16602-0.32617v-2c0-0.17115 0.0479-0.24087 0.16602-0.32617s0.32348-0.14844 0.5332-0.14844z',
                },
                {
                    key: 't',
                    route: 'm32 32h7',
                    frame: 'm38 29c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm38 29.5c-0.27614 0-0.5 0.22386-0.5 0.5s0.22386 0.5 0.5 0.5h0.5v3.5c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-3.5h0.5c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5z',
                },
                {
                    key: 'u',
                    route: 'm25 16-5 8',
                    frame: 'm19 21c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm19 21.5a0.5 0.5 0 0 0-0.5 0.5v3c0 0.4532 0.19298 0.85684 0.48438 1.1094s0.65729 0.36523 1.0156 0.36523 0.72423-0.1127 1.0156-0.36523 0.48438-0.65617 0.48438-1.1094v-3a0.5 0.5 0 0 0-0.5-0.5 0.5 0.5 0 0 0-0.5 0.5v3c0 0.1968-0.05702 0.28106-0.14062 0.35352-0.08361 0.07246-0.21771 0.12109-0.35938 0.12109s-0.27577-0.04863-0.35938-0.12109c-0.083609-0.072461-0.14062-0.15672-0.14062-0.35352v-3a0.5 0.5 0 0 0-0.5-0.5z',
                },
                {
                    key: 'v',
                    route: 'm20 8-7 4',
                    frame: 'm12 9c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm11.879 9.5156a0.5 0.5 0 0 0-0.36328 0.60547l1 4a0.50005 0.50005 0 0 0 0.96875 0l1-4a0.5 0.5 0 0 0-0.36328-0.60547 0.5 0.5 0 0 0-0.60547 0.36328l-0.51562 2.0625-0.51562-2.0625a0.5 0.5 0 0 0-0.60547-0.36328z',
                },
                {
                    key: 'w',
                    route: 'm25 48-5 8',
                    frame: 'm19 53c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm17.879 53.516a0.5 0.5 0 0 0-0.36328 0.60547l1 4a0.50005 0.50005 0 0 0 0.95898 0.03711l0.52539-1.5762 0.52539 1.5762a0.50005 0.50005 0 0 0 0.95898-0.03711l1-4a0.5 0.5 0 0 0-0.36328-0.60547 0.5 0.5 0 0 0-0.60547 0.36328l-0.58398 2.334-0.45703-1.3711a0.50005 0.50005 0 0 0-0.94922 0l-0.45703 1.3711-0.58398-2.334a0.5 0.5 0 0 0-0.60547-0.36328z',
                },
                {
                    key: 'x',
                    route: 'm44 8 7 4',
                    frame: 'm50 9c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm50.031 9.5c-0.0878-0.00506-0.17538 0.013132-0.25391 0.052734-0.24685 0.12312-0.34735 0.42289-0.22461 0.66992l0.88867 1.7773-0.88867 1.7773c-0.12274 0.24703-0.02224 0.5468 0.22461 0.66992 0.24703 0.12274 0.5468 0.02224 0.66992-0.22461l0.55273-1.1055 0.55273 1.1055c0.12312 0.24685 0.42289 0.34736 0.66992 0.22461 0.24685-0.12312 0.34736-0.42289 0.22461-0.66992l-0.88867-1.7773 0.88867-1.7773c0.12274-0.24703 0.02224-0.5468-0.22461-0.66992-0.11834-0.05914-0.25529-0.068973-0.38086-0.027344-0.12601 0.042231-0.23002 0.13289-0.28906 0.25195l-0.55273 1.1055-0.55273-1.1055c-0.059041-0.11906-0.16305-0.20972-0.28906-0.25195-0.041038-0.01393-0.083714-0.022465-0.12695-0.02539z',
                },
                {
                    key: 'y',
                    route: 'm50 28-6-4',
                    frame: 'm50 25c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z',
                    char: 'm52.006 25.5c-0.19172-0.0021-0.36775 0.10566-0.45312 0.27734l-0.55273 1.1055-0.55273-1.1055c-0.05904-0.11906-0.16305-0.20972-0.28906-0.25195-0.12557-0.04163-0.26252-0.0318-0.38086 0.02734-0.24685 0.12312-0.34736 0.42289-0.22461 0.66992l0.94727 1.8945v1.8828c0 0.27614 0.22386 0.5 0.5 0.5s0.5-0.22386 0.5-0.5v-1.8828l0.94727-1.8945c0.12274-0.24703 0.02224-0.5468-0.22461-0.66992-0.06737-0.03368-0.14148-0.05171-0.2168-0.05273z',
                },
                { key: '_1', route: 'm20 24-7 4', frame: 'm12 25c-1.6569 0-3 1.3431-3 3s1.3431 3 3 3h2c1.6569 0 3-1.3431 3-3s-1.3431-3-3-3z', char: '' },
                { key: '_3', route: 'm44 56 7 4', frame: 'm50 57c-1.6568 0-3 1.3432-3 3s1.3432 3 3 3h2c1.6568 0 3-1.3432 3-3s-1.3432-3-3-3z', char: '' },
            ].forEach((data) => {
                const route = SVG.path(data.route, { class: 'dash' });
                routes.appendChild(route);
                const frame = SVG.path(data.frame, { class: 'frame' });
                frames.appendChild(frame);
                if (!data.key.includes('_')) {
                    frame.addEventListener('click', () => {
                        this.addChar(data.key);
                    });
                }
                if (data.char) {
                    const char = SVG.path(data.char, { class: 'char' });
                    char.id = `char_${data.key}`;
                    frames.appendChild(char);
                }
                if (data.key.includes('_')) {
                    route.id = `route_e${data.key}`;
                    frame.id = `frame_e${data.key}`;
                }
                else {
                    route.id = `route_${data.key}`;
                    frame.id = `frame_${data.key}`;
                }
                codes[data.key] = {
                    value: data.key.includes('_') ? '' : data.key,
                    route: route,
                    frame: frame,
                };
            });
            frames.appendChild(SVG.path('m32 30-2 2 2 2 2-2z', { class: 'frame' }));
            this.svg = SVG.create(64, 64);
            this.svg.appendChild(routes);
            this.svg.appendChild(frames);
            return codes;
        }
    });
});
customElements.whenDefined('ango-contents.ts').then(() => {
});

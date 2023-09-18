const Common = (() => {
    function option(element) {
        return {
            get: (option) => {
                if (option) {
                    if (option.id) {
                        element.id = option.id;
                    }
                    if (option.class) {
                        const names = typeof option.class === 'string' ? [option.class] : option.class;
                        for (const name of names) {
                            element.classList.add(name);
                        }
                    }
                    if (option.colspan) {
                        element.colSpan = option.colspan;
                    }
                }
                return element;
            },
        };
    }
    return class {
        static toLowerCase(str) {
            return str.replace(/[A-Z]/g, (char) => {
                return String.fromCharCode(char.charCodeAt(0) | 32);
            });
        }
        static toUpperCase(str) {
            return str.replace(/[a-z]/g, (char) => {
                return String.fromCharCode(char.charCodeAt(0) & ~32);
            });
        }
        static div(...children) {
            const div = document.createElement('div');
            for (const child of children) {
                div.appendChild(child);
            }
            return option(div);
        }
        static span(content = '') {
            const span = document.createElement('span');
            if (content) {
                span.textContent = content;
            }
            return option(span);
        }
        static p(...children) {
            const p = document.createElement('p');
            for (const child of children) {
                if (typeof child === 'string') {
                    p.appendChild(document.createTextNode(child));
                }
                else {
                    p.appendChild(child);
                }
            }
            return option(p);
        }
        static pre() {
            const pre = document.createElement('pre');
            return option(pre);
        }
        static table(...children) {
            const table = document.createElement('table');
            for (const child of children) {
                table.appendChild(child);
            }
            return option(table);
        }
        static thead(content) {
            const thead = document.createElement('thead');
            if (content) {
                thead.appendChild(content);
            }
            return option(thead);
        }
        static tr(...tds) {
            const tr = document.createElement('tr');
            for (const td of tds) {
                tr.appendChild(td);
            }
            return option(tr);
        }
        static td(content) {
            const td = document.createElement('td');
            if (content) {
                if (typeof content === 'string') {
                    td.textContent = content;
                }
                else {
                    td.appendChild(content);
                }
            }
            return option(td);
        }
        static dl(...children) {
            const dl = document.createElement('dl');
            for (const child of children) {
                dl.appendChild(child);
            }
            return option(dl);
        }
        static dt(title) {
            const dt = document.createElement('dt');
            dt.textContent = title;
            return option(dt);
        }
        static dd(content) {
            const dd = document.createElement('dd');
            if (typeof content === 'string') {
                dd.textContent = content;
            }
            else {
                dd.appendChild(content);
            }
            return option(dd);
        }
        static button(text, callback) {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', callback);
            return option(button);
        }
        static textarea(placeholder) {
            const textarea = document.createElement('textarea');
            if (placeholder) {
                textarea.placeholder = placeholder;
            }
            return option(textarea);
        }
        static input() {
            const input = document.createElement('input');
            return option(input);
        }
        static inputText(placeholder) {
            const input = this.input();
            input.get().type = 'text';
            if (placeholder) {
                input.get().placeholder = placeholder;
            }
            return input;
        }
        static inputNumber(placeholder) {
            const input = this.input();
            input.get().type = 'number';
            if (placeholder) {
                input.get().placeholder = placeholder;
            }
            return input;
        }
        static select(...options) {
            const select = document.createElement('select');
            for (const child of options) {
                select.appendChild(child);
            }
            return option(select);
        }
        static option(text, value) {
            const opt = document.createElement('option');
            opt.textContent = text;
            opt.value = value;
            return option(opt);
        }
        static dialog(...contents) {
            const dialog = document.createElement('dialog');
            for (const child of contents) {
                dialog.appendChild(child);
            }
            return option(dialog);
        }
        static svg(width, height) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttributeNS(null, 'width', `${width}px`);
            svg.setAttributeNS(null, 'height', `${height}px`);
            svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
            return option(svg);
        }
        static path(d) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttributeNS(null, 'd', d);
            return option(path);
        }
        static circle(cx, cy, r) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttributeNS(null, 'cx', cx + '');
            circle.setAttributeNS(null, 'cy', cy + '');
            circle.setAttributeNS(null, 'r', r + '');
            return option(circle);
        }
        static g() {
            return document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }
    };
})();
class ServiceWorkerManager {
    static enable() {
        localStorage.removeItem('sw:disable');
    }
    static disable() {
        localStorage.setItem('sw:disable', 'true');
    }
    static toggle() {
        if (this.disableUser()) {
            this.enable();
        }
        else {
            this.disable();
        }
        return !this.disableUser();
    }
    static isEnable() {
        return location.protocol === 'https:' &&
            this.disableUser() &&
            'serviceWorker' in navigator;
    }
    static disableUser() {
        return localStorage.getItem('sw:disable') !== null;
    }
    static registered() {
        if (!this.isEnable()) {
            return Promise.reject(new Error('Cannot register ServiceWorker.'));
        }
        return navigator.serviceWorker.getRegistrations().then((registrations) => {
            if (0 < registrations.length) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Unregister ServiceWorker.'));
        });
    }
    static register() {
        if (this.isEnable()) {
            return navigator.serviceWorker.register('./sw.js');
        }
        return Promise.reject(new Error('Cannot register ServiceWorker.'));
    }
    static async unregister() {
        if (!this.isEnable()) {
            return Promise.reject(new Error('Cannot register ServiceWorker.'));
        }
        await navigator.serviceWorker.getRegistrations().then((registrations) => {
            let count = 0;
            for (const registration of registrations) {
                registration.unregister();
                ++count;
            }
            console.log(`Unregister ServiceWorker(${count})`);
        });
        await caches.keys().then(function (keys) {
            return Promise.all(keys.map((cacheName) => {
                if (cacheName) {
                    console.log(`Delete cache: ${cacheName}`);
                    return caches.delete(cacheName);
                }
                return Promise.resolve();
            })).then(() => {
                console.log('Delete caches complete!');
            }).catch((error) => {
                console.error(error);
            });
        });
    }
}
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
            this.menu = Common.select().get();
            this.menu.addEventListener('change', () => {
                this.page = this.menu.options[this.menu.selectedIndex].value;
            });
            const header = document.createElement('header');
            header.appendChild(this.menu);
            const contents = Common.div(document.createElement('slot')).get();
            const wrapper = Common.div(header, contents).get();
            shadow.appendChild(style);
            shadow.appendChild(wrapper);
            const params = new URLSearchParams(location.search);
            const page = params.get('page');
            if (page) {
                this.page = page;
            }
            this.addEventListener('register', (event) => {
                const target = event.target;
                this.addContent(target.tagName, target);
            }, true);
        }
        addContent(tag, content) {
            tag = tag.replace(/[A-Z]/g, (char) => {
                return String.fromCharCode(char.charCodeAt(0) | 32);
            });
            const option = Common.option(content.name, tag).get();
            if (this.page === tag || (this.page === '' && tag === 'ango-config')) {
                option.selected = true;
            }
            this.menu.appendChild(option);
            const names = [];
            for (const child of this.children) {
                const name = child.name;
                if (name) {
                    names.push(name);
                }
            }
            const options = [];
            for (const option of this.menu.children) {
                options.push(option);
            }
            options.sort((a, b) => {
                return names.indexOf(a.textContent || '') - names.indexOf(b.textContent || '');
            });
            for (const option of options) {
                this.menu.appendChild(option);
            }
        }
        get page() {
            return this.getAttribute('page') || '';
        }
        set page(value) {
            if (value === 'ango-config') {
                value = '';
            }
            if (this.page === value) {
                return;
            }
            if (value) {
                this.setAttribute('page', value);
                const page = this.page;
                const url = new URL(location.href);
                url.searchParams.set('page', page);
                if (location.search !== url.search) {
                    location.search = url.search;
                }
            }
            else {
                this.removeAttribute('page');
                const url = new URL(location.href);
                url.searchParams.delete('page');
                if (location.search !== url.search) {
                    location.search = url.search;
                }
            }
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'number-list';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        table;
        get name() {
            return 'Number list';
        }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; }',
                `:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
                '',
            ].join('');
            const contents = document.createElement('div');
            contents.appendChild(document.createElement('slot'));
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.dispatchEvent(new CustomEvent('register'));
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'ascii-code';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        table;
        get name() {
            return 'ASCII Table';
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
            const tr = Common.tr(Common.td().get()).get();
            for (let i = 2; i <= 7; ++i) {
                tr.appendChild(Common.td(`0x${i}`).get());
            }
            const thead = Common.thead(tr).get();
            this.table = Common.table().get();
            this.table.appendChild(thead);
            for (let n = 0; n < 16; ++n) {
                const tr = Common.tr().get();
                tr.appendChild(Common.td(n.toString(16)).get());
                this.table.appendChild(tr);
                for (let i = 2; i <= 7; ++i) {
                    const num = i * 16 + n;
                    const td = Common.td().get();
                    if (num < 127) {
                        const char = Common.pre().get();
                        char.textContent = String.fromCharCode(num);
                        const charCode = Common.div().get();
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
            const code = Common.inputText('Code').get();
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
            const text = Common.inputText('Text.').get();
            text.addEventListener('input', () => {
                const value = text.value.replace(/[^ \!\"\#\$\%\&\'\(\)\*\+\,\-\.\/0123456789\:\;\<\=\>\?\@ABCDEFGHIJKLMNOPQRSTUVWXYZ\[\\\]\^\_\`abcdefghijklmnopqrstuvwxyz\{\|\}\~]/g, '');
                text.value = value;
                code.value = value.split('').map((char) => {
                    return `0x${char.charCodeAt(0).toString(16)}`;
                }).join('');
            });
            const reset = Common.button('🗑', () => {
                code.value = '';
                text.value = '';
            }).get();
            const remove = Common.button('⇦', () => {
                const chars = text.value.split('');
                chars.pop();
                console.log(chars);
                text.value = chars.join('');
                code.value = chars.map((char) => {
                    return `0x${char.charCodeAt(0).toString(16)}`;
                }).join('');
            }).get();
            const inputs = Common.div(reset, code, text, remove).get();
            inputs.classList.add('input');
            const contents = Common.div(this.table, inputs).get();
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.dispatchEvent(new CustomEvent('register'));
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
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'ascii-keyboard';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        table;
        get name() {
            return 'ASCII Keyboard';
        }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; }',
                `:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
                ':host > div { display: grid; grid-template-rows: 2rem 1fr; grid-template-columns: calc(100% - 2rem) 2rem; }',
                ':host > div > div:not(:last-child) { overflow: hidden; }',
                ':host > div > div:not(:last-child) > slot { display: grid; width: 100%; height: 100%; }',
                ':host > div > div:last-child { display: flex; flex-wrap: wrap; justify-content: center; width: 100%; grid-row: 2 / 3; grid-column: 1 / 3; }',
            ].join('');
            const result = document.createElement('div');
            result.appendChild(((slot) => {
                slot.name = 'result';
                return slot;
            })(document.createElement('slot')));
            const clear = document.createElement('div');
            clear.appendChild(((slot) => {
                slot.name = 'clear';
                return slot;
            })(document.createElement('slot')));
            const buttons = document.createElement('div');
            buttons.appendChild(document.createElement('slot'));
            const contents = document.createElement('div');
            contents.appendChild(result);
            contents.appendChild(clear);
            contents.appendChild(buttons);
            shadow.appendChild(style);
            shadow.appendChild(contents);
            ((input) => {
                this.querySelector('button[slot="clear"]').addEventListener('click', () => {
                    input.value = '';
                });
                this.querySelectorAll('button:not([slot])').forEach((button) => {
                    const character = String.fromCharCode(parseInt(button.querySelector('span')?.textContent || '') || 0);
                    button.addEventListener('click', () => {
                        input.value += character;
                    });
                });
            })(this.querySelector('input'));
            this.dispatchEvent(new CustomEvent('register'));
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'base-number';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
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
                num.dataset.value = parseInt(decimal.value).toString(parseInt(option.dataset.base));
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
                        num.textContent = parseInt(num.dataset.value).toString(n);
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
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'base64-converter';
    if (customElements.get(tagname)) {
        return;
    }
    class Base64 {
        base64Table;
        emptyString;
        constructor() {
            this.table = ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'];
            this.empty = '=';
        }
        set table(table) {
            this.base64Table = table.join('');
        }
        get table() {
            return [...this.base64Table];
        }
        set empty(empty) {
            this.emptyString = empty;
        }
        get empty() {
            return this.emptyString;
        }
        toString(base64) {
            return new TextDecoder().decode(this.toUint8Array(base64));
        }
        toUint8Array(base64) {
            const str = base64.replace(new RegExp(this.emptyString, 'g'), '');
            if (str.match(new RegExp(`/[^${this.base64Table.replace(/[^0-9a-zA-Z]/g, '\\$1')}]/`))) {
                throw new Error('Invalid value. Exists illegal characters.');
            }
            const chars = [...str];
            const data = new Uint8Array(((chars.length + (chars.length % 4 ? 4 : 0)) >> 2) * 3);
            const converter = (char) => {
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
                if (w < data.length)
                    data[w++] = (a << 2) | (b >> 4);
                if (w < data.length && i + 2 < chars.length)
                    data[w++] = ((b & 0xF) << 4) | (c >> 2);
                if (w < data.length && i + 3 < chars.length)
                    data[w++] = ((c & 0x3) << 6) | d;
            }
            if (w === data.length)
                return data;
            const newData = new Uint8Array(w);
            newData.set(data.slice(0, w));
            return newData;
        }
        fromString(data) {
            return this.fromUint8Array((new TextEncoder()).encode(data));
        }
        fromUint8Array(buffer) {
            const base64 = [];
            for (let i = 0; i < buffer.length; i += 3) {
                const [a, b, c] = [buffer[i], buffer[i + 1] || 0, buffer[i + 2] || 0];
                base64.push(this.base64Table[a >> 2]);
                base64.push(this.base64Table[((a & 0x3) << 4) | (b >> 4)]);
                base64.push(i + 1 < buffer.length ? this.base64Table[(b & 0xF) << 2 | (c >> 6)] : this.emptyString);
                base64.push(i + 2 < buffer.length ? this.base64Table[c & 0x3F] : this.emptyString);
            }
            return base64.join('');
        }
    }
    customElements.define(tagname, class extends HTMLElement {
        base64;
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
                    const td = Common.td(Common.button(value, () => {
                        before.textContent = this.base64.table[index];
                        before.dataset.index = index + '';
                        dialog.showModal();
                    }).get()).get();
                    tr.appendChild(td);
                    const option = Common.option(value, value).get();
                    select.appendChild(option);
                }
            }
            table.appendChild(Common.tr(Common.td(Common.button(this.base64.empty, () => {
                before.textContent = this.base64.empty;
                dialog.showModal();
            }).get()).get({ colspan: 8 })).get());
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
                }
                else {
                    this.base64.empty = value;
                }
                base64.value = this.base64.fromString(text.value);
                dialog.close();
            }).get();
            const dialogContents = Common.div(before, select, update).get();
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
            this.dispatchEvent(new CustomEvent('register'));
        }
    });
});
const Morse = {
    DOT: false,
    DASH: true,
};
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
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
                ':host > div > div > div { display: grid; grid-template-rows: var(--card) calc(0.5 * var(--card)); border: 1px solid black; text-align: center; border-radius: calc(0.4 * var(--size)); cursor: pointer; pointer-events: auto; user-select: none; overflow: hidden; }',
                ':host > div > div > div > div:first-child { font-size: var(--card); line-height: var(--card); }',
                ':host > div > div > div > div:last-child { font-size: calc(0.5 * var(--card)); line-height: calc(0.5 * var(--card)); }',
            ].join('');
            this.previewDot = Common.div().get();
            this.previewDotMorse = Common.div().get();
            this.previewDash = Common.div().get();
            this.previewDashMorse = Common.div().get();
            this.previewNow = Common.div().get();
            this.previewNowMorse = Common.div().get();
            const dot = Common.div().get();
            dot.appendChild(this.previewDot);
            dot.appendChild(this.previewDotMorse);
            dot.addEventListener('click', (event) => {
                event.stopPropagation();
                this.dot();
            });
            const dash = Common.div().get();
            dash.appendChild(this.previewDash);
            dash.appendChild(this.previewDashMorse);
            dash.addEventListener('click', (event) => {
                event.stopPropagation();
                this.dash();
            });
            const now = Common.div().get();
            now.appendChild(this.previewNow);
            now.appendChild(this.previewNowMorse);
            now.addEventListener('contextmenu', (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.remove();
            });
            const cardPrev = Common.div().get();
            cardPrev.appendChild(dot);
            const cardDash = Common.div().get();
            cardDash.appendChild(dash);
            const cardNow = Common.div().get();
            cardNow.appendChild(now);
            const contents = Common.div().get();
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
    customElements.define(tagname, class MorseCode extends HTMLElement {
        root;
        svg;
        morse;
        text;
        preview;
        get name() {
            return 'Morse';
        }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; height: 100%; }',
                `:host-context(ango-contents:not([page="${tagname}"])) { display: none; }`,
                ':host > div { width: 100%; height: 100%; box-sizing: border-box; display: grid; grid-template-rows: 1fr 3rem 3rem 20vh 25vmin; grid-template-columns: 1fr 6rem; grid-template-areas: "a a" "b c" "d c" "e e" "f f"; }',
                'svg { --dot: #2f48b7; --dash: #a731dd; --frame: #333; --char: #fff; width: 100%; height: 100%; grid-area: a; }',
                'svg .selected { --dot: #d39e32; --dash: #d39e32; --frame: #9d7b36; }',
                'svg path.dot { stroke: var(--dot); }',
                'svg path.dash { stroke: var(--dash); }',
                'svg path.frame, svg circle.frame { fill: var(--frame); cursor: pointer; }',
                'svg path.char { fill: var(--char); pointer-events: none; }',
                'input[type="text"] { font-size: 3rem; width: 100%; box-sizing: border-box; }',
                '.reset { grid-area: c; margin: 0; font-size: 4rem; line-height: 4rem; overflow: hidden; }',
                '.preview { grid-area: e; }',
                'morse-preview { --size: 3vh; }',
                'div.inputs { width: 100%; height: 25vmin; display: flex; justify-content: center; overflow: hidden; grid-area: f; }',
                'div.inputs > button { font-size: 20vmin; padding: 0; line-height: 20vmin; width: 25vmin; height: 25vmin; box-sizing: border-box; }',
            ].join('');
            const codes = this.createSVG();
            this.root = this.createTree(codes);
            this.preview = new (customElements.get('morse-preview'))();
            this.preview.setMorseCode(this.root);
            this.preview.addEventListener('click', () => {
                this.addChar(this.preview.char);
            });
            const preview = Common.div(this.preview).get();
            preview.classList.add('preview');
            const remove = Common.button('⇦', () => {
                this.preview.remove();
                this.updateMorse();
            }).get();
            const dot = Common.button('・', () => {
                this.preview.dot();
                this.updateMorse();
            }).get();
            const dash = Common.button('－', () => {
                this.preview.dash();
                this.updateMorse();
            }).get();
            const enter = Common.button('↴', () => {
                this.addChar(this.preview.char);
            }).get();
            const inputs = Common.div(remove, dot, dash, enter).get();
            inputs.classList.add('inputs');
            this.morse = Common.inputText('Morse code. (. -)').get();
            this.morse.addEventListener('input', () => {
                this.morse.value = this.morse.value
                    .replace(/\s+/g, ' ')
                    .replace(/[^.-\s]+/g, '')
                    .replace(/^\s+/g, '');
                this.changeFromMorse();
            });
            this.text = Common.inputText('Text.').get();
            this.text.addEventListener('input', () => {
                this.changeFromText();
            });
            const reset = Common.button('🗑', () => {
                this.morse.value = '';
                this.text.value = '';
            }).get({ class: 'reset' });
            const contents = Common.div(this.svg, this.morse, reset, this.text, preview, inputs).get();
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.dispatchEvent(new CustomEvent('register'));
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
            const routes = Common.g();
            const frames = Common.g();
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
                const route = Common.path(data.route).get({ class: 'dot' });
                routes.appendChild(route);
                const frame = Common.circle(data.cx, data.cy, 3).get({ class: 'frame' });
                frames.appendChild(frame);
                if (!data.key.includes('_')) {
                    frame.addEventListener('click', () => {
                        this.addChar(data.key);
                    });
                }
                if (data.char) {
                    const char = Common.path(data.char).get({ class: 'char' });
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
                const route = Common.path(data.route).get({ class: 'dash' });
                routes.appendChild(route);
                const frame = Common.path(data.frame).get({ class: 'frame' });
                frames.appendChild(frame);
                if (!data.key.includes('_')) {
                    frame.addEventListener('click', () => {
                        this.addChar(data.key);
                    });
                }
                if (data.char) {
                    const char = Common.path(data.char).get({ class: 'char' });
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
            frames.appendChild(Common.path('m32 30-2 2 2 2 2-2z').get({ class: 'frame' }));
            this.svg = Common.svg(64, 64).get();
            this.svg.appendChild(routes);
            this.svg.appendChild(frames);
            return codes;
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'caesar-cipher';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        base;
        convert;
        baseRow;
        convertRow;
        centerColumn;
        shift;
        rawText;
        cipherText;
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
            const table = Common.table(this.baseRow, Common.tr(this.centerColumn).get(), this.convertRow).get();
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
            const controller = Common.div(sub, this.shift, add).get();
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
            }).get({ id: 'encryption' });
            const decryption = Common.button('<', () => {
                this.decrypt();
            }).get({ id: 'decryption' });
            const convertArea = Common.div(this.rawText, encryption, decryption, this.cipherText).get();
            const contents = Common.div(convertArea, table).get();
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.updateTable(0, [...'abcdefghijklmnopqrstuvwxyz']);
            this.dispatchEvent(new CustomEvent('register'));
        }
        get mode() {
            return this.getAttribute('mode') === 'cipher' ? 'cipher' : 'raw';
        }
        set mode(value) {
            this.setAttribute('mode', value === 'cipher' ? 'cipher' : 'raw');
        }
        updateTable(shift, table) {
            if (shift === undefined) {
                shift = parseInt(this.shift.value);
            }
            else {
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
            }
            else {
                this.encrypt(false);
            }
        }
        encrypt(update = true) {
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
        decrypt(update = true) {
            const text = Common.toLowerCase(this.cipherText.value);
            this.rawText.value = [...text].map((char) => {
                const index = this.convert.indexOf(char);
                if (index < 0) {
                    return char;
                }
                return this.base[index];
            }).join('');
            if (update) {
                this.mode = 'cipher';
            }
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'affine-cipher';
    if (customElements.get(tagname)) {
        return;
    }
    class Affine {
        characters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
        setCharacters(characters) {
            this.characters = [...characters];
        }
        encrypt(text, a, b) {
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
        decrypt(text, a, b) {
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
        toString() {
            return this.characters.join('');
        }
    }
    customElements.define(tagname, class extends HTMLElement {
        get name() {
            return 'Affine Cipher';
        }
        affine;
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
                }
                else {
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
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'vigenere-cipher';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        table;
        kv = {};
        value = {};
        key;
        vigenere;
        text;
        mode = false;
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
        update() {
            const key = [...Common.toUpperCase(this.key.value)];
            if (key.length <= 0) {
                return;
            }
            if (this.mode) {
                this.vigenere.value = [...Common.toUpperCase(this.text.value)].map((char, index) => {
                    const y = key[index % key.length];
                    console.log(`${y} ${char} => ${this.kv[y + char]}`);
                    return this.kv[y + char];
                }).join('');
            }
            else {
                this.text.value = [...Common.toUpperCase(this.vigenere.value)].map((char, index) => {
                    const y = key[index % key.length];
                    console.log(`${y} ${char} => ${this.value[y + char]}`);
                    return this.value[y + char];
                }).join('');
            }
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'adfgvx-cipher';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        table;
        key;
        adfgvx;
        text;
        mode = false;
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
            let target;
            for (let y = 0; y < 6; ++y) {
                for (let x = -1; x < 6; ++x) {
                    if (x < 0) {
                        this.table.appendChild(Common.span(chars[y]).get());
                    }
                    else {
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
            this.dispatchEvent(new CustomEvent('register'));
        }
        update() {
            const values = {};
            const keys = {};
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
                const stage1 = Common.toLowerCase(this.text.value).split('').map((char) => {
                    return values[char].id;
                }).join('');
                const stage2 = [];
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
            }
            else {
                const length = this.adfgvx.value.length;
                const max = tkey.map((v, index) => {
                    return Math.floor(length / tkey.length) + (index < length % tkey.length ? 1 : 0);
                });
                const stage1 = tkey.map(() => {
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
                const stage2 = [];
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
                const stage3 = [];
                for (let i = 0; i < stage2.length; i += 2) {
                    stage3.push(stage2[i] + stage2[i + 1]);
                }
                this.text.value = stage3.map((key) => {
                    return keys[key];
                }).join('');
            }
        }
    });
});
((script, init) => {
    customElements.whenDefined('ango-contents').then(() => {
        init(script);
    });
})(document.currentScript, (script) => {
    const tagname = 'ango-config';
    if (customElements.get(tagname)) {
        return;
    }
    customElements.define(tagname, class extends HTMLElement {
        get name() {
            return 'Config';
        }
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.innerHTML = [
                ':host { display: block; }',
                `:host-context(ango-contents[page]) { display: none; }`,
                'h1 { display: block; width: 4rem; height: 4rem; background: center no-repeat url(./favicon.svg); margin: 0.5rem auto; overflow: hidden; text-indent: 8rem; }',
                'div, p { font-size: 1rem; margin: 0.5rem auto; width: 100%; max-width: 40rem; }',
            ].join('');
            const h1 = document.createElement('h1');
            h1.textContent = 'ango';
            const detail = Common.p('何らかの謎解き系の暗号解読に使えそうなツール群です。').get();
            const dl = Common.dl().get();
            dl.appendChild(Common.dt('Remove ServiceWorker.').get());
            dl.appendChild(Common.dd(Common.button('Remove', () => {
                ServiceWorkerManager.unregister();
            }).get()).get());
            dl.appendChild(Common.dt('Register ServiceWorker.').get());
            dl.appendChild(Common.dd(Common.button('Register', () => {
                ServiceWorkerManager.register();
            }).get()).get());
            function updateSwitch(enable) {
                switchTitle.textContent = `Switch ServiceWorker. [${enable ? 'Enable' : 'Disable'}]`;
                switchSW.textContent = enable ? 'Deactivate' : 'Activate';
            }
            const switchTitle = Common.dt('Switch ServiceWorker.').get();
            const switchSW = Common.button('', () => {
                updateSwitch(ServiceWorkerManager.toggle());
            }).get();
            updateSwitch(!ServiceWorkerManager.disableUser());
            dl.appendChild(switchTitle);
            dl.appendChild(Common.dd(switchSW).get());
            const config = Common.div(dl).get();
            const contents = Common.div().get();
            contents.appendChild(h1);
            contents.appendChild(detail);
            contents.appendChild(config);
            shadow.appendChild(style);
            shadow.appendChild(contents);
            this.dispatchEvent(new CustomEvent('register'));
        }
    });
});
customElements.whenDefined('ango-contents.ts').then(() => {
});
ServiceWorkerManager.register();

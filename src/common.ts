const Common = (() => {
	function option<T extends HTMLElement|SVGElement>(element: T) {
		return {
			get: (option?: {id?: string, class?: string[]|string}) => {
				if (option) {
					if(option.id) {
						element.id = option.id;
					}
					if(option.class) {
						const names = typeof option.class === 'string' ? [option.class] : option.class;
						for(const name of names) {
							element.classList.add(name);
						}
					}
				}
				return element;
			},
		};
	}

	return class {
		static toLowerCase(str: string) {
			return str.replace(/[A-Z]/g, (char) => {
				return String.fromCharCode(char.charCodeAt(0) | 32);
			});
		}
	
		static toUpperCase(str: string) {
			return str.replace(/[a-z]/g, (char) => {
				return String.fromCharCode(char.charCodeAt(0) & ~32);
			});
		}
	
		static div(...children: (HTMLElement|SVGElement)[]) {
			const div = document.createElement('div');
			for (const child of children) {
				div.appendChild(child);
			}
			return option(div);
		}
	
		static p(...children: (HTMLElement|string)[]) {
			const p = document.createElement('p');
			for (const child of children) {
				if (typeof child === 'string') {
					p.appendChild(document.createTextNode(child));
				}else{
					p.appendChild(child);
				}
			}
			return option(p);
		}
	
		static pre() {
			const pre = document.createElement('pre');
			return option(pre);
		}
	
		static table(... children:(HTMLTableRowElement)[]) {
			const table = document.createElement('table');
			for (const child of children) {
				table.appendChild(child);
			}
			return option(table);
		}
	
		static thead(content?: HTMLTableRowElement) {
			const thead = document.createElement('thead');
			if (content) {
				thead.appendChild(content);
			}
			return option(thead);
		}
	
		static tr(...tds: HTMLTableCellElement[]) {
			const tr = document.createElement('tr');
			for (const td of tds) {
				tr.appendChild(td);
			}
			return option(tr);
		}
	
		static td(content?: string | HTMLElement) {
			const td = document.createElement('td');
			if (content) {
				if (typeof content === 'string') {
					td.textContent = content;
				} else {
					td.appendChild(content);
				}
			}
			return option(td);
		}
	
		static dl(...children: HTMLElement[]) {
			const dl = document.createElement('dl');
			for (const child of children) {
				dl.appendChild(child);
			}
			return option(dl);
		}
	
		static dt(title: string) {
			const dt = document.createElement('dt');
			dt.textContent = title;
			return option(dt);
		}
	
		static dd(content: string | HTMLElement) {
			const dd = document.createElement('dd');
			if (typeof content === 'string') {
				dd.textContent = content;
			} else {
				dd.appendChild(content);
			}
			return option(dd);
		}
	
		static button(text: string, callback: () => unknown) {
			const button = document.createElement('button');
			button.textContent = text;
			button.addEventListener('click', callback);
			return option(button);
		}
	
		static textarea(placeholder?: string) {
			const textarea = document.createElement('textarea');
			if(placeholder){
				textarea.placeholder = placeholder;
			}
			return option(textarea);
		}
	
		static input() {
			const input = document.createElement('input');
			return option(input);
		}
	
		static inputText(placeholder?: string) {
			const input = this.input();
			input.get().type = 'text';
			if(placeholder) {
				input.get().placeholder = placeholder;
			}
			return input;
		}
	
		static inputNumber() {
			const input = this.input();
			input.get().type = 'number';
			return input;
		}
	
		static select(...options: HTMLOptionElement[]) {
			const select = document.createElement('select');
			for (const child of options) {
				select.appendChild(child);
			}
			return option(select);
		}
	
		static svg(width: number, height: number) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttributeNS(null, 'width', `${width}px`);
			svg.setAttributeNS(null, 'height', `${height}px`);
			svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);
			return option(svg);
		}
	
		static path(d: string) {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttributeNS(null, 'd', d);
			return option(path);
		}
	
		static circle(cx: number, cy: number, r: number) {
			const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttributeNS(null, 'cx', cx + '');
			circle.setAttributeNS(null, 'cy', cy + '');
			circle.setAttributeNS(null, 'r', r + '');
			return option(circle);
		}
	
		static g() {
			return document.createElementNS('http://www.w3.org/2000/svg', 'g');
		}
	}
})();

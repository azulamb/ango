/// <reference path="./ango-contents.ts" />
/// <reference path="./ascii-code.ts" />
/// <reference path="./morse-code.ts" />

customElements.whenDefined('ango-contents.ts').then(() => {
});

if (location.protocol === 'https:' && 'serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js');
}

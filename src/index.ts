/// <reference path="./sw.ts" />
/// <reference path="./ango-contents.ts" />
/// <reference path="./ascii-code.ts" />
/// <reference path="./morse-code.ts" />
/// <reference path="./ango-config.ts" />

customElements.whenDefined('ango-contents.ts').then(() => {
});

ServiceWorkerManager.register();

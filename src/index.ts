/// <reference path="./common.ts" />
/// <reference path="./sw.ts" />
/// <reference path="./ango-contents.ts" />
/// <reference path="./number-list.ts" />
/// <reference path="./ascii-code.ts" />
/// <reference path="./ascii-keyboard.ts" />
/// <reference path="./base-number.ts" />
/// <reference path="./base64-converter.ts" />
/// <reference path="./base64-hex.ts" />
/// <reference path="./morse-code.ts" />
/// <reference path="./caesar-cipher.ts" />
/// <reference path="./affine-cipher.ts" />
/// <reference path="./vigenere-cipher.ts" />
/// <reference path="./adfgvx-cipher.ts" />
/// <reference path="./ango-config.ts" />

customElements.whenDefined('ango-contents.ts').then(() => {
});

ServiceWorkerManager.register();

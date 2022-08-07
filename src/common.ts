class Common {
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
}

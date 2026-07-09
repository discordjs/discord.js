export const register: unknown = (() => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
		const { app } = require('electron');
		return app.setAsDefaultProtocolClient.bind(app);
	} catch {
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			return require('register-scheme');
		} catch {
			return false;
		}
	}
})();

export function getPid() {
	// eslint-disable-next-line n/prefer-global/process
	if (typeof globalThis.process !== 'undefined') {
		// eslint-disable-next-line n/prefer-global/process
		return process.pid;
	}

	return null;
}

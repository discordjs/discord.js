import { createRequire } from 'node:module';

export const register: () => Promise<boolean | unknown> = async () => {
	const require = createRequire(import.meta.url);
	try {
		const { app } = require('electron');
		return app.setAsDefaultProtocolClient.bind(app);
	} catch {
		try {
			return require('register-scheme');
		} catch {
			return false;
		}
	}
};

export function getPid() {
	// eslint-disable-next-line n/prefer-global/process
	if (typeof globalThis.process !== 'undefined') {
		// eslint-disable-next-line n/prefer-global/process
		return process.pid;
	}

	return null;
}

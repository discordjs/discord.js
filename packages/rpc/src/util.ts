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
	if (typeof globalThis.process !== 'undefined') {
		return process.pid;
	}

	return null;
}

export function isValidTimestamp(timestamp: number) {
	return Number.isInteger(timestamp) && timestamp >= 0 && timestamp <= 2_147_483_647_000;
}

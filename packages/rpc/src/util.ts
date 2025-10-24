import type { RPCLoginOptions } from './client';

export const register: (scheme: string) => boolean = (() => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
		const { app } = require('electron');
		return app.setAsDefaultProtocolClient.bind(app);
	} catch {
		try {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			return require('register-scheme');
		} catch {}
	}
})();

export function getPid() {
	// eslint-disable-next-line n/prefer-global/process
	if (typeof globalThis.process !== 'undefined') {
		// eslint-disable-next-line n/prefer-global/process, no-restricted-globals
		return process.pid;
	}

	return null;
}

export function mergeRPCLoginOptions(
	options: Partial<RPCLoginOptions>,
	otheroptions: Partial<RPCLoginOptions>,
): RPCLoginOptions {
	return {
		clientId: options.clientId ?? otheroptions.clientId!,
		scopes: options.scopes ?? otheroptions.scopes!,
		clientSecret: options.clientSecret ?? otheroptions.clientSecret!,
		redirectUri: options.redirectUri ?? otheroptions.redirectUri!,
		accessToken: options.accessToken ?? otheroptions.accessToken!,
		username: options.username ?? otheroptions.username!,
	};
}

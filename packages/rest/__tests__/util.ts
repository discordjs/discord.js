import { DefaultRestOptions } from '../src';

export function genPath(path: string) {
	return `/api/v${DefaultRestOptions.version}${path}`;
}

export function jsonHeaders(headers: Record<string, string> = {}) {
	return {
		headers: {
			'content-type': 'application/json',
			...headers,
		},
	};
}

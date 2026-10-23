import { afterEach, describe, expect, test, vi } from 'vitest';
import { shouldUseGlobalFetchAndWebSocket } from '../src/index.js';

describe('shouldUseGlobalFetchAndWebSocket', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	test('GIVEN browser env with fetch and WebSocket THEN returns true', () => {
		vi.stubGlobal('process', undefined);
		vi.stubGlobal('fetch', () => void 0);
		vi.stubGlobal('WebSocket', class {});
		expect(shouldUseGlobalFetchAndWebSocket()).toBe(true);
	});

	test('GIVEN browser env without fetch or WebSocket THEN returns false', () => {
		vi.stubGlobal('process', undefined);
		vi.stubGlobal('fetch', globalThis.fetch);
		vi.stubGlobal('WebSocket', globalThis.WebSocket);
		// @ts-expect-error Testing missing globals
		delete globalThis.fetch;
		// @ts-expect-error Testing missing globals
		delete globalThis.WebSocket;
		expect(shouldUseGlobalFetchAndWebSocket()).toBe(false);
	});

	test('GIVEN Cloudflare Workers with nodejs_compat THEN returns true', () => {
		vi.stubGlobal('process', { versions: { node: '22.19.0' } });
		vi.stubGlobal('WebSocketPair', class {});
		expect(shouldUseGlobalFetchAndWebSocket()).toBe(true);
	});

	test('GIVEN Node.js THEN returns false', () => {
		vi.stubGlobal('process', { versions: { node: '22.19.0' } });
		expect(shouldUseGlobalFetchAndWebSocket()).toBe(false);
	});

	test('GIVEN Deno THEN returns true', () => {
		vi.stubGlobal('process', { versions: { deno: '1.0.0' } });
		expect(shouldUseGlobalFetchAndWebSocket()).toBe(true);
	});

	test('GIVEN Bun THEN returns true', () => {
		vi.stubGlobal('process', { versions: { bun: '1.0.0' } });
		expect(shouldUseGlobalFetchAndWebSocket()).toBe(true);
	});
});

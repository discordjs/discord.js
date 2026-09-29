import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import middleware, { config } from '../src/middleware.js';

vi.mock('@/util/fetchLatestVersion', () => ({
	fetchLatestVersion: vi.fn(async () => '14.27.0'),
}));

describe('docs middleware', () => {
	beforeEach(() => vi.clearAllMocks());

	test.each(['https://discordjs.dev', 'https://discord.js.org'])(
		'redirects the unversioned package URL on %s',
		async (origin) => {
			const response = await middleware(new NextRequest(`${origin}/docs/packages/discord.js`));
			expect(response.headers.get('location')).toBe(`${origin}/docs/packages/discord.js/14.27.0`);
		},
	);

	test('matches the unversioned package URL', () => {
		expect(unstable_doesMiddlewareMatch({ config, url: 'https://discordjs.dev/docs/packages/discord.js' })).toBe(true);
		expect(unstable_doesMiddlewareMatch({ config, url: 'https://discordjs.dev/docs/packages/discord.js/main' })).toBe(
			false,
		);
	});

	test('keeps the homepage Docs redirect', async () => {
		const response = await middleware(new NextRequest('https://discordjs.dev/docs'));
		expect(response.headers.get('location')).toBe('https://discordjs.dev/docs/packages/discord.js/14.27.0');
	});

	test('keeps stable package redirects', async () => {
		const response = await middleware(
			new NextRequest('https://discordjs.dev/docs/packages/discord.js/stable/Client:Class'),
		);
		expect(response.headers.get('location')).toBe(
			'https://discordjs.dev/docs/packages/discord.js/14.27.0/Client:Class',
		);
	});
});

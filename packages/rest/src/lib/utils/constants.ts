import { lazy, shouldUseGlobalFetchAndWebSocket } from '@discordjs/util';
import { APIVersion } from 'discord-api-types/v10';
import type { RESTOptions, ResponseLike } from '../REST.js';

const getUndiciRequest = lazy(async () => {
	try {
		return await import('../../strategies/undiciRequest.js');
	} catch {
		return null;
	}
});

export const DefaultUserAgent =
	`DiscordBot (https://discord.js.org, [VI]{{inject}}[/VI])` as `DiscordBot (https://discord.js.org, ${string})`;

/**
 * The default string to append onto the user agent.
 */
export const DefaultUserAgentAppendix =
	// Most (if not all) edge environments will have `process` defined. Withing a web browser we'll extract it using `navigator.userAgent`.

	typeof process === 'object'
		? process.release?.name === 'node'
			? `Node.js/${process.version}`
			: ''
		: // @ts-expect-error web env
		typeof window === 'object'
		? // @ts-expect-error web env
		  window.navigator.userAgent
		: '';

export const DefaultRestOptions = {
	agent: null,
	api: 'https://discord.com/api',
	authPrefix: 'Bot',
	cdn: 'https://cdn.discordapp.com',
	headers: {},
	invalidRequestWarningInterval: 0,
	globalRequestsPerSecond: 50,
	offset: 50,
	rejectOnRateLimit: null,
	retries: 3,
	timeout: 15_000,
	userAgentAppendix: DefaultUserAgentAppendix,
	version: APIVersion,
	hashSweepInterval: 14_400_000, // 4 Hours
	hashLifetime: 86_400_000, // 24 Hours
	handlerSweepInterval: 3_600_000, // 1 Hour
	async makeRequest(...args): Promise<ResponseLike> {
		const defaultToFetch = shouldUseGlobalFetchAndWebSocket();

		if (defaultToFetch) {
			// @ts-expect-error We know this is defined based on the check above
			return globalThis.fetch(...args);
		}

		const strategy = await getUndiciRequest();

		if (strategy === null) {
			return fetch(...args);
		} else {
			return strategy.makeRequest(...args);
		}
	},
} as const satisfies Required<RESTOptions>;

/**
 * The events that the REST manager emits
 */
export enum RESTEvents {
	Debug = 'restDebug',
	HandlerSweep = 'handlerSweep',
	HashSweep = 'hashSweep',
	InvalidRequestWarning = 'invalidRequestWarning',
	RateLimited = 'rateLimited',
	Response = 'response',
}

export const ALLOWED_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg', 'gif'] as const satisfies readonly string[];
export const ALLOWED_STICKER_EXTENSIONS = ['png', 'json', 'gif'] as const satisfies readonly string[];
export const ALLOWED_SIZES = [16, 32, 64, 128, 256, 512, 1_024, 2_048, 4_096] as const satisfies readonly number[];

export type ImageExtension = (typeof ALLOWED_EXTENSIONS)[number];
export type StickerExtension = (typeof ALLOWED_STICKER_EXTENSIONS)[number];
export type ImageSize = (typeof ALLOWED_SIZES)[number];

export const OverwrittenMimeTypes = {
	// https://github.com/discordjs/discord.js/issues/8557
	'image/apng': 'image/png',
} as const satisfies Readonly<Record<string, string>>;

export const BurstHandlerMajorIdKey = 'burst';

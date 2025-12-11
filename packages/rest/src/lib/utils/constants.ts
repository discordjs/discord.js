import { getUserAgentAppendix } from '@discordjs/util';
import type { ImageSize } from 'discord-api-types/v10';
import { APIVersion } from 'discord-api-types/v10';
import { getDefaultStrategy } from '../../environment.js';
import type { RESTOptions, ResponseLike } from './types.js';

export type { ImageSize } from 'discord-api-types/v10';

export const DefaultUserAgent =
	`DiscordBot (https://discord.js.org, [VI]{{inject}}[/VI])` as `DiscordBot (https://discord.js.org, ${string})`;

/**
 * The default string to append onto the user agent.
 */
export const DefaultUserAgentAppendix = getUserAgentAppendix();

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
	retryBackoff: 0,
	timeout: 15_000,
	userAgentAppendix: DefaultUserAgentAppendix,
	version: APIVersion,
	hashSweepInterval: 14_400_000, // 4 Hours
	hashLifetime: 86_400_000, // 24 Hours
	handlerSweepInterval: 3_600_000, // 1 Hour
	async makeRequest(...args): Promise<ResponseLike> {
		return getDefaultStrategy()(...args);
	},
	mediaProxy: 'https://media.discordapp.net',
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
export const ALLOWED_SIZES: readonly number[] = [
	16, 32, 64, 128, 256, 512, 1_024, 2_048, 4_096,
] satisfies readonly ImageSize[];

export type ImageExtension = (typeof ALLOWED_EXTENSIONS)[number];
export type StickerExtension = (typeof ALLOWED_STICKER_EXTENSIONS)[number];

export const OverwrittenMimeTypes = {
	// https://github.com/discordjs/discord.js/issues/8557
	'image/apng': 'image/png',
} as const satisfies Readonly<Record<string, string>>;

export const BurstHandlerMajorIdKey = 'burst';

export const AUTH_UUID_NAMESPACE = 'acc82a4c-f887-417b-a69c-f74096ff7e59';

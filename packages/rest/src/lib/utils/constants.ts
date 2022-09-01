import process from 'node:process';
import { APIVersion } from 'discord-api-types/v10';
import { getGlobalDispatcher } from 'undici';
import type { RESTOptions } from '../REST.js';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const Package = require('../../../package.json');

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
export const DefaultUserAgent = `DiscordBot (${Package.homepage}, ${Package.version})`;

export const DefaultRestOptions: Required<RESTOptions> = {
	get agent() {
		return getGlobalDispatcher();
	},
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
	userAgentAppendix: `Node.js ${process.version}`,
	version: APIVersion,
	hashSweepInterval: 14_400_000, // 4 Hours
	hashLifetime: 86_400_000, // 24 Hours
	handlerSweepInterval: 3_600_000, // 1 Hour
};

/**
 * The events that the REST manager emits
 */
export const enum RESTEvents {
	Debug = 'restDebug',
	HandlerSweep = 'handlerSweep',
	HashSweep = 'hashSweep',
	InvalidRequestWarning = 'invalidRequestWarning',
	RateLimited = 'rateLimited',
	Response = 'response',
}

export const ALLOWED_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg', 'gif'] as const;
export const ALLOWED_STICKER_EXTENSIONS = ['png', 'json'] as const;
export const ALLOWED_SIZES = [16, 32, 64, 128, 256, 512, 1_024, 2_048, 4_096] as const;

export type ImageExtension = typeof ALLOWED_EXTENSIONS[number];
export type StickerExtension = typeof ALLOWED_STICKER_EXTENSIONS[number];
export type ImageSize = typeof ALLOWED_SIZES[number];

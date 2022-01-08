import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import type { REST } from '@discordjs/rest';
import { RESTGetAPIGatewayBotResult, Routes } from 'discord-api-types/v9';
import { z } from 'zod';

export const pathToFilePredicate = z
	.string()
	.transform(resolve)
	.refine((path) => statSync(path).isFile(), { message: 'Could not resolve path to a file' });

export function createDeferredPromise<T = unknown>() {
	let resolve!: (value: T | PromiseLike<T>) => void;
	let reject!: (reason?: unknown) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

export interface DeferredPromise<T = unknown> {
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: unknown) => void;
	promise: Promise<T>;
}

export const fetchRecommendedShardsOptionsPredicate = z.strictObject({
	guildsPerShard: z.number().int().gt(0).default(1000),
	multipleOf: z.number().int().gt(0).default(1),
});

/**
 * Gets the recommended shard count from Discord.
 * @param rest The REST handler.
 * @param options The options for the recommended shards.
 * @returns The amount of shards to create.
 */
export async function fetchRecommendedShards(rest: REST, options: FetchRecommendedShardsOptions = {}) {
	const { guildsPerShard, multipleOf } = fetchRecommendedShardsOptionsPredicate.parse(options);
	const { shards } = (await rest.get(Routes.gatewayBot())) as RESTGetAPIGatewayBotResult;
	return Math.ceil((shards * (1_000 / guildsPerShard)) / multipleOf) * multipleOf;
}

export interface FetchRecommendedShardsOptions {
	/**
	 * Number of guilds assigned per shard.
	 * @default 1000
	 */
	guildsPerShard?: number;

	/**
	 * The multiple the shard count should round up to. (16 for large bot sharding).
	 * @default 1
	 */
	multipleOf?: number;
}

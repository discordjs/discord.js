/* eslint-disable jsdoc/check-param-names */

import type { REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIStickerPackResult,
	type RESTGetAPIStickerResult,
	type RESTGetStickerPacksResult,
	type Snowflake,
} from 'discord-api-types/v10';
import type { RequestOptions } from '../util/types.js';

export class StickersAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches a sticker pack
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker-pack}
	 * @param packId - The id of the sticker pack
	 * @param options - The options for fetching the sticker pack
	 */
	public async getStickerPack(
		packId: Snowflake,
		{ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {},
	) {
		return this.rest.get(Routes.stickerPack(packId), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIStickerPackResult>;
	}

	/**
	 * Fetches all of the sticker packs
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-sticker-packs}
	 * @param options - The options for fetching the sticker packs
	 */
	public async getStickers({ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {}) {
		return this.rest.get(Routes.stickerPacks(), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetStickerPacksResult>;
	}

	/**
	 * Fetches a sticker
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
	 * @param stickerId - The id of the sticker
	 * @param options - The options for fetching the sticker
	 */
	public async get(
		stickerId: Snowflake,
		{ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {},
	) {
		return this.rest.get(Routes.sticker(stickerId), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIStickerResult>;
	}
}

/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIStickerResult,
	type RESTGetNitroStickerPacksResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class StickersAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all of the nitro sticker packs
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#list-nitro-sticker-packs}
	 * @param options - The options for fetching the sticker packs
	 */
	public async getNitroStickers({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.nitroStickerPacks(), { signal }) as Promise<RESTGetNitroStickerPacksResult>;
	}

	/**
	 * Fetches a sticker
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
	 * @param stickerId - The id of the sticker
	 * @param options - The options for fetching the sticker
	 */
	public async get(stickerId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.sticker(stickerId), { signal }) as Promise<RESTGetAPIStickerResult>;
	}
}

import type { REST } from '@discordjs/rest';
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
	 * @param options - The options to use when fetching the sticker packs
	 */
	public async getNitroStickers({ signal }: { signal?: AbortSignal | undefined } = {}) {
		return this.rest.get(Routes.nitroStickerPacks(), { signal }) as Promise<RESTGetNitroStickerPacksResult>;
	}

	/**
	 * Fetches a sticker
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
	 * @param stickerId - The id of the sticker
	 * @param options - The options to use when fetching the sticker
	 */
	public async get(stickerId: Snowflake, { signal }: { signal?: AbortSignal | undefined } = {}) {
		return this.rest.get(Routes.sticker(stickerId), { signal }) as Promise<RESTGetAPIStickerResult>;
	}
}

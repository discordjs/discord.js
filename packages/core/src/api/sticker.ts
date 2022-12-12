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
	 */
	public async getNitroStickers() {
		return this.rest.get(Routes.nitroStickerPacks()) as Promise<RESTGetNitroStickerPacksResult>;
	}

	/**
	 * Fetches a sticker
	 *
	 * @see {@link https://discord.com/developers/docs/resources/sticker#get-sticker}
	 * @param stickerId - The id of the sticker
	 */
	public async get(stickerId: Snowflake) {
		return this.rest.get(Routes.sticker(stickerId)) as Promise<RESTGetAPIStickerResult>;
	}
}

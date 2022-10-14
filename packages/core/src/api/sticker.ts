import type { REST } from '@discordjs/rest';
import { Routes, type APISticker, type RESTGetNitroStickerPacksResult } from 'discord-api-types/v10';

export class StickersAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all of the nitro sticker packs
	 */
	public async getNitroStickers() {
		return (await this.rest.get(Routes.nitroStickerPacks())) as RESTGetNitroStickerPacksResult;
	}

	/**
	 * Fetches a sticker
	 *
	 * @param stickerId - The id of the sticker
	 */
	public async get(stickerId: string) {
		return (await this.rest.get(Routes.sticker(stickerId))) as APISticker;
	}
}

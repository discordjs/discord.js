import type { REST } from '@discordjs/rest';
import type { RESTGetNitroStickerPacksResult } from 'discord-api-types/v10';
import { Routes, type APISticker } from 'discord-api-types/v10';

export class StickersAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

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

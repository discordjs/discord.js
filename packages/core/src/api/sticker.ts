import type { REST } from '@discordjs/rest';
import type { RESTGetNitroStickerPacksResult } from 'discord-api-types/v10';
import { Routes, type APISticker } from 'discord-api-types/v10';

export const stickers = (api: REST) => ({
	async getNitroStickers() {
		return (await api.get(Routes.nitroStickerPacks())) as RESTGetNitroStickerPacksResult;
	},

	async get(stickerId: string) {
		return (await api.get(Routes.sticker(stickerId))) as APISticker;
	},
});

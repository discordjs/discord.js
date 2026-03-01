import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	type APIUser,
	StickerFormatType,
	StickerType,
	type APISticker,
	type APIStickerPack,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { Sticker, StickerPack } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const user: APIUser = {
	id: '230523489548375',
	username: 'idk',
	discriminator: '0000',
	global_name: 'idk',
	avatar: '7256708436578243659397823786595968875',
};

const sticker: APISticker = {
	id: '345543',
	description: 'a lovely sticker',
	pack_id: '43543262456',
	name: 'some lovely stickers',
	guild_id: '43539827528935',
	tags: 'typescript-is-awersome',
	type: StickerType.Guild,
	format_type: StickerFormatType.GIF,
	available: true,
	sort_value: 45,
	user,
};

const stickerPack: APIStickerPack = {
	id: '23404858943543',
	stickers: [sticker],
	name: 'a lovely sticker pack',
	sku_id: '4354354354355534554355435435',
	description: "a lovely sticker pack's description",
};

describe('Sticker sub-structure', () => {
	const data = sticker;
	const instance = new Sticker(data);

	test('correct value for all getters', () => {
		expect(instance.available).toBe(data.available);
		expect(instance.description).toBe(data.description);
		expect(instance.formatType).toBe(data.format_type);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.tags).toBe(data.tags);
		expect(instance.type).toBe(data.type);

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const tags = 'is-html-a-language';

		const patched = instance[kPatch]({
			tags,
		});

		expect(instance.tags).toEqual(tags);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});

describe('StickerPack structure', () => {
	const data = stickerPack;
	const instance = new StickerPack(data);

	test('correct value for all getters', () => {
		expect(instance.bannerAssetId).toBe(data.banner_asset_id);
		expect(instance.coverStickerId).toBe(data.cover_sticker_id);
		expect(instance.description).toBe(data.description);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.skuId).toBe(data.sku_id);

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const name = 'a lovely new name for a lovely sticker pack';

		const patched = instance[kPatch]({
			name,
		});

		expect(patched.name).toEqual(name);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});

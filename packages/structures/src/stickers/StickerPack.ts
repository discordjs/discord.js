import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIStickerPack } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a sticker pack on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `Sticker` which needs to be instantiated and stored by an extending class using it
 */
export class StickerPack<Omitted extends keyof APIStickerPack | '' = ''> extends Structure<APIStickerPack, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each sticker pack
	 */
	public static override DataTemplate: Partial<APIStickerPack> = {};

	/**
	 * @param data - The raw data received from the API for the sticker pack
	 */
	public constructor(data: Partialize<APIStickerPack, Omitted>) {
		super(data);
	}

	/**
	 * The id of the sticker pack
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the sticker pack
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The id of the pack's SKU
	 */
	public get skuId() {
		return this[kData].sku_id;
	}

	/**
	 * The id of a sticker in the pack which is shown as the pack's icon
	 */
	public get coverStickerId() {
		return this[kData].cover_sticker_id;
	}

	/**
	 * The description of the sticker pack
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The id of the sticker pack's {@link https://discord.com/developers/docs/reference#image-formatting | banner image}
	 */
	public get bannerAssetId() {
		return this[kData].banner_asset_id;
	}

	/**
	 * The timestamp the sticker pack was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the sticker pack was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}

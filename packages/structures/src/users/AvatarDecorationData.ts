import { CDNRoutes, RouteBases, type APIAvatarDecorationData } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isFieldSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents metadata of an avatar decoration of a User.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class AvatarDecorationData<Omitted extends keyof APIAvatarDecorationData | '' = ''> extends Structure<
	APIAvatarDecorationData,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each Connection
	 */
	public static override readonly DataTemplate: Partial<APIAvatarDecorationData> = {};

	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIAvatarDecorationData, Omitted>) {
		super(data);
	}

	/**
	 * The id of the SKU this avatar decoration is part of.
	 */
	public get skuId() {
		return this[kData].sku_id;
	}

	/**
	 * The asset of this avatar decoration.
	 */
	public get asset() {
		return this[kData].asset;
	}

	/**
	 * Get the URL to the asset of this avatar decoration
	 *
	 * @returns the URL to the asset of this avatar decoration
	 */
	public assetURL() {
		return isFieldSet(this[kData], 'asset', 'string')
			? `${RouteBases.cdn}${CDNRoutes.avatarDecoration(this[kData].asset)}`
			: null;
	}
}

import type { APIAvatarDecorationData } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';

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
	 * The id of the SKU this avatar decoration is part of.
	 */
	public get skuId() {
		return this[kData].sku_id;
	}

	/**
	 * The asset of this avatar decoration.
	 */
	public get name() {
		return this[kData].asset;
	}
}

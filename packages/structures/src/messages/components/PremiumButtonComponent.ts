import type { APIButtonComponentWithSKUId, ButtonStyle } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { ButtonComponent } from './ButtonComponent.js';

/**
 * Represents a button used to buy an SKU from a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class PremiumButtonComponent<
	Omitted extends keyof APIButtonComponentWithSKUId | '' = '',
> extends ButtonComponent<ButtonStyle.Premium, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each PremiumButtonComponent.
	 */
	public static override readonly DataTemplate: Partial<APIButtonComponentWithSKUId> = {};

	/**
	 * @param data - The raw data received from the API for the premium button
	 */
	public constructor(data: Partialize<APIButtonComponentWithSKUId, Omitted>) {
		super(data);
	}

	/**
	 * The id for a purchasable SKU
	 */
	public get skuId() {
		return this[kData].sku_id;
	}
}

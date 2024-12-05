import type { APIButtonComponentWithSKUId, Snowflake } from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { BaseButtonBuilder } from './Button.js';

/**
 * A builder that creates API-compatible JSON data for premium buttons.
 */
export class PremiumButtonBuilder extends BaseButtonBuilder<APIButtonComponentWithSKUId> {
	protected override readonly data: Partial<APIButtonComponentWithSKUId>;

	public constructor(data: Partial<APIButtonComponentWithSKUId> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.Button, style: ButtonStyle.Premium };
	}

	/**
	 * Sets the SKU id that represents a purchasable SKU for this button.
	 *
	 * @remarks Only available when using premium-style buttons.
	 * @param skuId - The SKU id to use
	 */
	public setSKUId(skuId: Snowflake) {
		this.data.sku_id = skuId;
		return this;
	}
}

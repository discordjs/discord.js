import type { APIButtonComponentWithCustomId, ButtonStyle } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import type { ButtonDataType } from './ButtonComponent.js';
import { NonPremiumButton } from './NonPremiumButton.js';

/**
 * Represents a button causing a ButtonInteraction on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class InteractiveButton<
	Style extends ButtonStyle.Danger | ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success,
	Omitted extends keyof APIButtonComponentWithCustomId | '' = '',
> extends NonPremiumButton<Style, Omitted> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIButtonComponentWithCustomId, Omitted>) {
		super(data as ButtonDataType<Style>);
	}

	public get customId() {
		return this[kData].custom_id;
	}
}

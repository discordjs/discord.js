import type { ButtonStyle } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import type { ButtonDataType } from './ButtonComponent.js';
import { ButtonComponent } from './ButtonComponent.js';

/**
 * Base class for all buttons that can have a label on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `ComponentEmoji` which needs to be instantiated and stored by an extending class using it
 */
export abstract class NonPremiumButtonComponent<
	Style extends Exclude<ButtonStyle, ButtonStyle.Premium>,
	Omitted extends keyof ButtonDataType<Style> | '' = '',
> extends ButtonComponent<Style, Omitted> {
	/**
	 * @param data - The raw data received from the API for the button
	 */
	public constructor(data: Partialize<ButtonDataType<Style>, Omitted>) {
		super(data);
	}

	/**
	 * The label to be displayed on the button
	 */
	public get label() {
		return this[kData].label;
	}
}

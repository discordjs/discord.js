import type { APIChannelSelectComponent, ChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { SelectMenuComponent } from './SelectMenuComponent.js';

/**
 * Represents a channel select menu component.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `SelectMenuDefaultValue`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class ChannelSelectMenuComponent<
	Omitted extends keyof APIChannelSelectComponent | '' = '',
> extends SelectMenuComponent<APIChannelSelectComponent, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each ChannelSelectMenuComponent.
	 */
	public static override readonly DataTemplate: Partial<APIChannelSelectComponent> = {};

	/**
	 * @param data - The raw data received from the API for the channel select menu
	 */
	public constructor(data: Partialize<APIChannelSelectComponent, Omitted>) {
		super(data);
	}

	/**
	 * The timestamp this call ended at, or `null`if it didn't end yet
	 */
	public get channelTypes() {
		return Array.isArray(this[kData].channel_types) ? (this[kData].channel_types as readonly ChannelType[]) : null;
	}
}

import type { APIChannelSelectComponent } from 'discord-api-types/v10';
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
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIChannelSelectComponent, Omitted>) {
		super(data);
	}
}

import type { APIContainerComponent } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a container component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `Component`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class ContainerComponent<Omitted extends keyof APIContainerComponent | '' = ''> extends Component<
	APIContainerComponent,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIContainerComponent, Omitted>) {
		super(data);
	}

	public get accentColor() {
		return this[kData].accent_color;
	}

	public get spoiler() {
		return this[kData].spoiler;
	}
}

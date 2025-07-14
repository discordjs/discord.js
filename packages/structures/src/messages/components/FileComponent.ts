import type { APIFileComponent } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a file component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `UnfurledMediaItem` which needs to be instantiated and stored by an extending class using it
 */
export class FileComponent<Omitted extends keyof APIFileComponent | '' = ''> extends Component<
	APIFileComponent,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIFileComponent, Omitted>) {
		super(data);
	}

	public get spoiler() {
		return this[kData].spoiler;
	}
}

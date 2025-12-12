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
	 * The template used for removing data from the raw data stored for each FileComponent.
	 */
	public static override readonly DataTemplate: Partial<APIFileComponent> = {};

	/**
	 * @param data - The raw data received from the API for the file component
	 */
	public constructor(data: Partialize<APIFileComponent, Omitted>) {
		super(data);
	}

	/**
	 * Whether the media should be a spoiler (or blurred out)
	 */
	public get spoiler() {
		return this[kData].spoiler;
	}

	/**
	 * The name of the file
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The size of the file in bytes
	 */
	public get size() {
		return this[kData].size;
	}
}

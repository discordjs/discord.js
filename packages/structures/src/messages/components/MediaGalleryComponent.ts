import type { APIMediaGalleryComponent } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a container component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `MediaGalleryItem`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class MediaGalleryComponent<Omitted extends keyof APIMediaGalleryComponent | '' = ''> extends Component<
	APIMediaGalleryComponent,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the connection
	 */
	public constructor(data: Partialize<APIMediaGalleryComponent, Omitted>) {
		super(data);
	}
}

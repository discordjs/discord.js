import type { APISectionComponent } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a section component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `Component`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class SectionComponent<Omitted extends keyof APISectionComponent | '' = ''> extends Component<
	APISectionComponent,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each SectionComponent.
	 */
	public static override readonly DataTemplate: Partial<APISectionComponent> = {};

	/**
	 * @param data - The raw data received from the API for the section
	 */
	public constructor(data: Partialize<APISectionComponent, Omitted>) {
		super(data);
	}
}

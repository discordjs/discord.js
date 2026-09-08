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
	 * The template used for removing data from the raw data stored for each ContainerComponent.
	 */
	public static override readonly DataTemplate: Partial<APIContainerComponent> = {};

	/**
	 * @param data - The raw data received from the API for the container
	 */
	public constructor(data: Partialize<APIContainerComponent, Omitted>) {
		super(data);
	}

	/**
	 * Color for the accent on the container as RGB
	 */
	public get accentColor() {
		return this[kData].accent_color;
	}

	/**
	 * The hexadecimal version of the accent color, with a leading hash
	 */
	public get hexAccentColor() {
		const accentColor = this.accentColor;
		if (typeof accentColor !== 'number') return accentColor;
		return `#${accentColor.toString(16).padStart(6, '0')}`;
	}

	/**
	 * Whether the container should be a spoiler (or blurred out)
	 */
	public get spoiler() {
		return this[kData].spoiler;
	}
}

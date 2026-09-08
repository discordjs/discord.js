import type { APILabelComponent, ComponentType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import type { ComponentDataType } from './Component.js';
import { Component } from './Component.js';

/**
 * Represents a label component on a modal.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `Component`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class LabelComponent<Omitted extends keyof APILabelComponent | '' = ''> extends Component<
	ComponentDataType<ComponentType.Label>,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each LabelComponent.
	 */
	public static override readonly DataTemplate: Partial<ComponentDataType<ComponentType.Label>> = {};

	/**
	 * @param data - The raw data received from the API for the label
	 */
	public constructor(data: Partialize<ComponentDataType<ComponentType.Label>, Omitted>) {
		super(data);
	}

	/**
	 * The label text
	 */
	public get label() {
		return this[kData].label;
	}

	/**
	 * An optional description text for the label
	 */
	public get description() {
		return this[kData].description;
	}
}

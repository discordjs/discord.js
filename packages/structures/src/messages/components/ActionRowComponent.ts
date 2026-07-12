import type { APIActionRowComponent, APIComponentInActionRow, ComponentType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types.js';
import type { ComponentDataType } from './Component.js';
import { Component } from './Component.js';

/**
 * Represents an action row component on a message or modal.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has `Component`s as substructures which need to be instantiated and stored by an extending class using it
 */
export class ActionRowComponent<
	Type extends APIComponentInActionRow,
	Omitted extends keyof APIActionRowComponent<Type> | '' = '',
> extends Component<ComponentDataType<ComponentType.ActionRow>, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each ActionRowComponent.
	 */
	public static override readonly DataTemplate: Partial<ComponentDataType<ComponentType.ActionRow>> = {};

	/**
	 * @param data - The raw data received from the API for the action row
	 */
	public constructor(data: Partialize<ComponentDataType<ComponentType.ActionRow>, Omitted>) {
		super(data);
	}
}

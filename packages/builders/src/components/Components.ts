import { APIMessageComponent, ComponentType } from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, Component, SelectMenuComponent } from '../index';
import type { ActionRowComponent } from './ActionRow';

export interface MappedComponentTypes {
	[ComponentType.ActionRow]: ActionRow<ActionRowComponent>;
	[ComponentType.Button]: ButtonComponent;
	[ComponentType.SelectMenu]: SelectMenuComponent;
}

/**
 * Factory for creating components from API data
 * @param data The api data to transform to a component class
 */
export function createComponent<T extends keyof MappedComponentTypes>(
	data: APIMessageComponent & { type: T },
): MappedComponentTypes[T];
export function createComponent(data: APIMessageComponent): Component {
	switch (data.type) {
		case ComponentType.ActionRow:
			return new ActionRow(data);
		case ComponentType.Button:
			return new ButtonComponent(data);
		case ComponentType.SelectMenu:
			return new SelectMenuComponent(data);
		default:
			// @ts-expect-error
			throw new Error(`Cannot serialize component type: ${data.type as number}`);
	}
}

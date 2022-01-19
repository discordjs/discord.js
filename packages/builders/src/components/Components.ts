import { APIMessageComponent, ComponentType } from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, Component, SelectMenuComponent, InputTextComponent } from '../index';
import type { MessageComponent } from './ActionRow';

export interface MappedComponentTypes {
	[ComponentType.ActionRow]: ActionRow;
	[ComponentType.Button]: ButtonComponent;
	[ComponentType.SelectMenu]: SelectMenuComponent;
	// TODO: use dapi enum
	[4]: InputTextComponent;
}

/**
 * Factory for creating components from API data
 * @param data The api data to transform to a component class
 */
export function createComponent<T extends keyof MappedComponentTypes>(
	data: APIMessageComponent & { type: T },
): MappedComponentTypes[T];
export function createComponent<C extends MessageComponent>(data: C): C;
export function createComponent(data: APIMessageComponent | MessageComponent): Component {
	if (data instanceof Component) {
		return data;
	}

	switch (data.type) {
		case ComponentType.ActionRow:
			return new ActionRow(data);
		case ComponentType.Button:
			return new ButtonComponent(data);
		case ComponentType.SelectMenu:
			return new SelectMenuComponent(data);
		case 4:
			// @ts-expect-error
			return new InputTextComponent(data);
		default:
			// @ts-expect-error
			throw new Error(`Cannot serialize component type: ${data.type as number}`);
	}
}

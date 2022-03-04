import { APIBaseComponent, APIMessageComponent, APIModalComponent, ComponentType } from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, Component, SelectMenuComponent, TextInputComponent } from '../index';
import type { MessageComponent, ModalActionRowComponent } from './ActionRow';

export interface MappedComponentTypes {
	[ComponentType.ActionRow]: ActionRow;
	[ComponentType.Button]: ButtonComponent;
	[ComponentType.SelectMenu]: SelectMenuComponent;
	[ComponentType.TextInput]: TextInputComponent;
}

/**
 * Factory for creating components from API data
 * @param data The api data to transform to a component class
 */
export function createComponent<T extends keyof MappedComponentTypes>(
	data: (APIMessageComponent | APIModalComponent) & { type: T },
): MappedComponentTypes[T];
export function createComponent<C extends MessageComponent | ModalActionRowComponent>(data: C): C;
export function createComponent(data: APIModalComponent | APIMessageComponent | Component): Component {
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
		case ComponentType.TextInput:
			return new TextInputComponent(data);
		default:
			throw new Error(`Cannot serialize component type: ${(data as APIBaseComponent<ComponentType>).type}`);
	}
}

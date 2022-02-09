import {
	APIActionRowComponentTypes,
	APIMessageComponent,
	APIModalComponent,
	ComponentType,
} from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, Component, SelectMenuComponent, TextInputComponent } from '../index';

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
	data: APIMessageComponent & { type: T },
): MappedComponentTypes[T];
export function createComponent<C extends APIModalComponent | APIMessageComponent>(data: C): C;
export function createComponent(data: APIModalComponent | APIMessageComponent): Component {
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
			// @ts-expect-error
			return new TextInputComponent(data);
		default:
			// @ts-expect-error
			throw new Error(`Cannot serialize component type: ${data.type as number}`);
	}
}

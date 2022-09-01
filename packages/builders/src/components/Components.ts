import { ComponentType, type APIMessageComponent, type APIModalComponent } from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	type AnyComponentBuilder,
	type MessageComponentBuilder,
	type ModalComponentBuilder,
} from './ActionRow.js';
import { ComponentBuilder } from './Component.js';
import { ButtonBuilder } from './button/Button.js';
import { SelectMenuBuilder } from './selectMenu/SelectMenu.js';
import { TextInputBuilder } from './textInput/TextInput.js';

export interface MappedComponentTypes {
	[ComponentType.ActionRow]: ActionRowBuilder<AnyComponentBuilder>;
	[ComponentType.Button]: ButtonBuilder;
	[ComponentType.SelectMenu]: SelectMenuBuilder;
	[ComponentType.TextInput]: TextInputBuilder;
}

/**
 * Factory for creating components from API data
 *
 * @param data - The api data to transform to a component class
 */
export function createComponentBuilder<T extends keyof MappedComponentTypes>(
	// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
	data: (APIModalComponent | APIMessageComponent) & { type: T },
): MappedComponentTypes[T];
export function createComponentBuilder<C extends MessageComponentBuilder | ModalComponentBuilder>(data: C): C;
export function createComponentBuilder(
	data: APIMessageComponent | APIModalComponent | MessageComponentBuilder,
): ComponentBuilder {
	if (data instanceof ComponentBuilder) {
		return data;
	}

	switch (data.type) {
		case ComponentType.ActionRow:
			return new ActionRowBuilder(data);
		case ComponentType.Button:
			return new ButtonBuilder(data);
		case ComponentType.SelectMenu:
			return new SelectMenuBuilder(data);
		case ComponentType.TextInput:
			return new TextInputBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported component type
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			throw new Error(`Cannot properly serialize component type: ${data.type}`);
	}
}

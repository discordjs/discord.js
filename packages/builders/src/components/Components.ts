import { APIMessageComponent, APIModalComponent, ComponentType } from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	type AnyComponentBuilder,
	type MessageComponentBuilder,
	type ModalComponentBuilder,
} from './ActionRow';
import { ComponentBuilder } from './Component';
import { ButtonBuilder } from './button/Button';
import { SelectMenuBuilder } from './selectMenu/SelectMenu';
import { TextInputBuilder } from './textInput/TextInput';

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
	data: (APIMessageComponent | APIModalComponent) & { type: T },
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
			// @ts-expect-error
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			throw new Error(`Cannot properly serialize component type: ${data.type}`);
	}
}

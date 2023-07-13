import { ComponentType, type APIMessageComponent, type APIModalComponent } from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	type AnyComponentBuilder,
	type MessageComponentBuilder,
	type ModalComponentBuilder,
} from './ActionRow.js';
import { ComponentBuilder } from './Component.js';
import { ButtonBuilder } from './button/Button.js';
import { ChannelSelectMenuBuilder } from './selectMenu/ChannelSelectMenu.js';
import { MentionableSelectMenuBuilder } from './selectMenu/MentionableSelectMenu.js';
import { RoleSelectMenuBuilder } from './selectMenu/RoleSelectMenu.js';
import { StringSelectMenuBuilder } from './selectMenu/StringSelectMenu.js';
import { UserSelectMenuBuilder } from './selectMenu/UserSelectMenu.js';
import { TextInputBuilder } from './textInput/TextInput.js';

/**
 * Components here are mapped to their respective builder.
 */
export interface MappedComponentTypes {
	/**
	 * The action row component type is associated with an {@link ActionRowBuilder}.
	 */
	[ComponentType.ActionRow]: ActionRowBuilder<AnyComponentBuilder>;
	/**
	 * The button component type is associated with an {@link ButtonBuilder}.
	 */
	[ComponentType.Button]: ButtonBuilder;
	/**
	 * The string select component type is associated with an {@link StringSelectMenuBuilder}.
	 */
	[ComponentType.StringSelect]: StringSelectMenuBuilder;
	/**
	 * The text inpiut component type is associated with an {@link TextInputBuilder}.
	 */
	[ComponentType.TextInput]: TextInputBuilder;
	/**
	 * The user select component type is associated with an {@link UserSelectMenuBuilder}.
	 */
	[ComponentType.UserSelect]: UserSelectMenuBuilder;
	/**
	 * The role select component type is associated with an {@link RoleSelectMenuBuilder}.
	 */
	[ComponentType.RoleSelect]: RoleSelectMenuBuilder;
	/**
	 * The mentionable select component type is associated with an {@link MentionableSelectMenuBuilder}.
	 */
	[ComponentType.MentionableSelect]: MentionableSelectMenuBuilder;
	/**
	 * The channel select component type is associated with an {@link ChannelSelectMenuBuilder}.
	 */
	[ComponentType.ChannelSelect]: ChannelSelectMenuBuilder;
}

/**
 * Factory for creating components from API data.
 *
 * @typeParam T - The type of component to use
 * @param data - The API data to transform to a component class
 */
export function createComponentBuilder<T extends keyof MappedComponentTypes>(
	// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
	data: (APIModalComponent | APIMessageComponent) & { type: T },
): MappedComponentTypes[T];

/**
 * Factory for creating components from API data.
 *
 * @typeParam C - The type of component to use
 * @param data - The API data to transform to a component class
 */
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
		case ComponentType.StringSelect:
			return new StringSelectMenuBuilder(data);
		case ComponentType.TextInput:
			return new TextInputBuilder(data);
		case ComponentType.UserSelect:
			return new UserSelectMenuBuilder(data);
		case ComponentType.RoleSelect:
			return new RoleSelectMenuBuilder(data);
		case ComponentType.MentionableSelect:
			return new MentionableSelectMenuBuilder(data);
		case ComponentType.ChannelSelect:
			return new ChannelSelectMenuBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported component type
			throw new Error(`Cannot properly serialize component type: ${data.type}`);
	}
}

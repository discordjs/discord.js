/* eslint-disable jsdoc/check-param-names */

import {
	type APIActionRowComponent,
	ComponentType,
	type APIMessageActionRowComponent,
	type APIModalActionRowComponent,
	type APIActionRowComponentTypes,
} from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { ComponentBuilder } from './Component.js';
import { createComponentBuilder } from './Components.js';
import type { ButtonBuilder } from './button/Button.js';
import type { ChannelSelectMenuBuilder } from './selectMenu/ChannelSelectMenu.js';
import type { MentionableSelectMenuBuilder } from './selectMenu/MentionableSelectMenu.js';
import type { RoleSelectMenuBuilder } from './selectMenu/RoleSelectMenu.js';
import type { StringSelectMenuBuilder } from './selectMenu/StringSelectMenu.js';
import type { UserSelectMenuBuilder } from './selectMenu/UserSelectMenu.js';
import type { TextInputBuilder } from './textInput/TextInput.js';

/**
 * The builders that may be used for messages.
 */
export type MessageComponentBuilder =
	| ActionRowBuilder<MessageActionRowComponentBuilder>
	| MessageActionRowComponentBuilder;

/**
 * The builders that may be used for modals.
 */
export type ModalComponentBuilder = ActionRowBuilder<ModalActionRowComponentBuilder> | ModalActionRowComponentBuilder;

/**
 * The builders that may be used within an action row for messages.
 */
export type MessageActionRowComponentBuilder =
	| ButtonBuilder
	| ChannelSelectMenuBuilder
	| MentionableSelectMenuBuilder
	| RoleSelectMenuBuilder
	| StringSelectMenuBuilder
	| UserSelectMenuBuilder;

/**
 * The builders that may be used within an action row for modals.
 */
export type ModalActionRowComponentBuilder = TextInputBuilder;

/**
 * Any builder!
 */
export type AnyComponentBuilder = MessageActionRowComponentBuilder | ModalActionRowComponentBuilder;

/**
 * A builder that creates API-compatible JSON data for action rows.
 *
 * @typeParam T - The types of components this action row holds
 */
export class ActionRowBuilder<T extends AnyComponentBuilder> extends ComponentBuilder<
	APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>
> {
	/**
	 * The components within this action row.
	 */
	public readonly components: T[];

	/**
	 * Creates a new action row from API data.
	 *
	 * @param data - The API data to create this action row with
	 * @example
	 * Creating an action row from an API data object:
	 * ```ts
	 * const actionRow = new ActionRowBuilder({
	 * 	components: [
	 * 		{
	 * 			custom_id: "custom id",
	 * 			label: "Type something",
	 * 			style: TextInputStyle.Short,
	 * 			type: ComponentType.TextInput,
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating an action row using setters and API data:
	 * ```ts
	 * const actionRow = new ActionRowBuilder({
	 * 	components: [
	 * 		{
	 * 			custom_id: "custom id",
	 * 			label: "Click me",
	 * 			style: ButtonStyle.Primary,
	 * 			type: ComponentType.Button,
	 * 		},
	 * 	],
	 * })
	 * 	.addComponents(button2, button3);
	 * ```
	 */
	public constructor({ components, ...data }: Partial<APIActionRowComponent<APIActionRowComponentTypes>> = {}) {
		super({ type: ComponentType.ActionRow, ...data });
		this.components = (components?.map((component) => createComponentBuilder(component)) ?? []) as T[];
	}

	/**
	 * Adds components to this action row.
	 *
	 * @param components - The components to add
	 */
	public addComponents(...components: RestOrArray<T>) {
		this.components.push(...normalizeArray(components));
		return this;
	}

	/**
	 * Sets components for this action row.
	 *
	 * @param components - The components to set
	 */
	public setComponents(...components: RestOrArray<T>) {
		this.components.splice(0, this.components.length, ...normalizeArray(components));
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIActionRowComponent<ReturnType<T['toJSON']>> {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		} as APIActionRowComponent<ReturnType<T['toJSON']>>;
	}
}

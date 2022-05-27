import {
	type APIActionRowComponent,
	ComponentType,
	APIMessageActionRowComponent,
	APIModalActionRowComponent,
	APIActionRowComponentTypes,
} from 'discord-api-types/v10';
import { ComponentBuilder } from './Component';
import { createComponentBuilder } from './Components';
import type { ButtonBuilder } from './button/Button';
import type { SelectMenuBuilder } from './selectMenu/SelectMenu';
import type { TextInputBuilder } from './textInput/TextInput';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray';

export type MessageComponentBuilder =
	| MessageActionRowComponentBuilder
	| ActionRowBuilder<MessageActionRowComponentBuilder>;
export type ModalComponentBuilder = ModalActionRowComponentBuilder | ActionRowBuilder<ModalActionRowComponentBuilder>;
export type MessageActionRowComponentBuilder = ButtonBuilder | SelectMenuBuilder;
export type ModalActionRowComponentBuilder = TextInputBuilder | SelectMenuBuilder;
export type AnyComponentBuilder = MessageActionRowComponentBuilder | ModalActionRowComponentBuilder;

/**
 * Represents an action row component
 */
export class ActionRowBuilder<T extends AnyComponentBuilder> extends ComponentBuilder<
	APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>
> {
	/**
	 * The components within this action row
	 */
	public readonly components: T[];

	public constructor({ components, ...data }: Partial<APIActionRowComponent<APIActionRowComponentTypes>> = {}) {
		super({ type: ComponentType.ActionRow, ...data });
		this.components = (components?.map((c) => createComponentBuilder(c)) ?? []) as T[];
	}

	/**
	 * Adds components to this action row.
	 *
	 * @param components - The components to add to this action row.
	 */
	public addComponents(...components: RestOrArray<T>) {
		this.components.push(...normalizeArray(components));
		return this;
	}

	/**
	 * Sets the components in this action row
	 *
	 * @param components - The components to set this row to
	 */
	public setComponents(...components: RestOrArray<T>) {
		this.components.splice(0, this.components.length, ...normalizeArray(components));
		return this;
	}

	public toJSON(): APIActionRowComponent<ReturnType<T['toJSON']>> {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		} as APIActionRowComponent<ReturnType<T['toJSON']>>;
	}
}

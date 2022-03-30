import {
	type APIActionRowComponent,
	ComponentType,
	APIMessageActionRowComponent,
	APIModalActionRowComponent,
} from 'discord-api-types/v10';
import type { ButtonBuilder, SelectMenuBuilder, TextInputBuilder } from '..';
import { ComponentBuilder } from './Component';
import { createComponentBuilder } from './Components';

export type MessageComponentBuilder =
	| MessageActionRowComponentBuilder
	| ActionRowBuilder<MessageActionRowComponentBuilder>;
export type ModalComponentBuilder = ModalActionRowComponentBuilder | ActionRowBuilder<ModalActionRowComponentBuilder>;

export type MessageActionRowComponentBuilder = ButtonBuilder | SelectMenuBuilder;
export type ModalActionRowComponentBuilder = TextInputBuilder;

/**
 * Represents an action row component
 */
export class ActionRowBuilder<
	T extends MessageActionRowComponentBuilder | ModalActionRowComponentBuilder =
		| MessageActionRowComponentBuilder
		| ModalActionRowComponentBuilder,
> extends ComponentBuilder<
	Omit<
		Partial<APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>> & {
			type: ComponentType.ActionRow;
		},
		'components'
	>
> {
	/**
	 * The components within this action row
	 */
	private readonly components: T[];

	public constructor({
		components,
		...data
	}: Partial<APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>> = {}) {
		super({ type: ComponentType.ActionRow, ...data });
		this.components = (components?.map((c) => createComponentBuilder(c)) ?? []) as T[];
	}

	/**
	 * Adds components to this action row.
	 * @param components The components to add to this action row.
	 * @returns
	 */
	public addComponents(...components: T[]) {
		this.components.push(...components);
		return this;
	}

	/**
	 * Sets the components in this action row
	 * @param components The components to set this row to
	 */
	public setComponents(...components: T[]) {
		this.components.splice(0, this.components.length, ...components);
		return this;
	}

	public toJSON(): APIActionRowComponent<ReturnType<T['toJSON']>> {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()) as ReturnType<T['toJSON']>[],
		};
	}
}

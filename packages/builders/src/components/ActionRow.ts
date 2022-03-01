import {
	type APIActionRowComponent,
	ComponentType,
	APIMessageComponent,
	APIMessageActionRowComponent,
	APIModalActionRowComponent,
} from 'discord-api-types/v9';
import type { ButtonBuilder, SelectMenuBuilder, TextInputComponent } from '..';
import { ComponentBuilder } from './Component';
import { createComponentBuilder } from './Components';

export type MessageComponentBuilder =
	| MessageActionRowBuilderComponent
	| ActionRowBuilder<MessageActionRowBuilderComponent>;
export type ModalComponentBuilder = ModalActionRowBuilderComponent | ActionRowBuilder<ModalActionRowBuilderComponent>;

export type MessageActionRowBuilderComponent = ButtonBuilder | SelectMenuBuilder;
export type ModalActionRowBuilderComponent = TextInputComponent;

/**
 * Represents an action row component
 */
export class ActionRowBuilder<
	T extends MessageActionRowBuilderComponent | ModalActionRowBuilderComponent =
		| MessageActionRowBuilderComponent
		| ModalActionRowBuilderComponent,
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

import { type APIActionRowComponent, ComponentType, APIMessageComponent } from 'discord-api-types/v9';
import type { ButtonComponent, SelectMenuComponent } from '..';
import { Component } from './Component';
import { createComponent } from './Components';

export type MessageComponent = ActionRowComponent | ActionRow;

export type ActionRowComponent = ButtonComponent | SelectMenuComponent;

// TODO: Add valid form component types

export interface ActionRowData extends Omit<APIActionRowComponent, 'type' | 'components'> {
	type?: ComponentType.ActionRow;
	components?: Exclude<APIMessageComponent, APIActionRowComponent>[];
}

/**
 * Represents an action row component
 */
export class ActionRow<T extends ActionRowComponent = ActionRowComponent> extends Component<
	Omit<APIActionRowComponent, 'components'>
> {
	public readonly components: T[];

	public constructor({ components, ...data }: ActionRowData = {}) {
		super({ type: ComponentType.ActionRow, ...data });
		this.components = (components?.map(createComponent) ?? []) as T[];
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
	public setComponents(components: T[]) {
		this.components.splice(0, this.components.length, ...components);
		return this;
	}

	public toJSON(): APIActionRowComponent {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		};
	}
}

import { type APIActionRowComponent, ComponentType } from 'discord-api-types/v9';
import type { ButtonComponent, SelectMenuComponent } from '..';
import { Component } from './Component';
import { createComponent } from './Components';

export type MessageComponent = ActionRowComponent | ActionRow;

export type ActionRowComponent = ButtonComponent | SelectMenuComponent;

// TODO: Add valid form component types

/**
 * Represents an action row component
 */
export class ActionRow<T extends ActionRowComponent = ActionRowComponent> extends Component {
	protected declare data: APIActionRowComponent;
	public readonly components: T[] = [];

	public constructor(data?: APIActionRowComponent & { type?: ComponentType.ActionRow }) {
		super(data);
		this.data.type ??= ComponentType.ActionRow;
		this.components = (data?.components.map(createComponent) ?? []) as T[];
	}

	public get type(): ComponentType.ActionRow {
		return this.data.type;
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
		this.components.slice(0, this.components.length);
		this.components.push(...components);
		return this;
	}

	public toJSON(): APIActionRowComponent {
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		};
	}
}

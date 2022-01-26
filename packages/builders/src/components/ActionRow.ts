import { APIActionRowComponent, ComponentType } from 'discord-api-types/v9';
import type { ButtonComponent, SelectMenuComponent } from '..';
import type { Component } from './Component';
import { createComponent } from './Components';

export type MessageComponent = ActionRowComponent | ActionRow;

export type ActionRowComponent = ButtonComponent | SelectMenuComponent;

// TODO: Add valid form component types

/**
 * Represents an action row component
 */
export class ActionRow<T extends ActionRowComponent = ActionRowComponent> implements Component {
	public readonly components: T[] = [];
	public readonly type = ComponentType.ActionRow;

	public constructor(data?: APIActionRowComponent) {
		this.components = (data?.components.map(createComponent) ?? []) as T[];
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
		Reflect.set(this, 'components', [...components]);
		return this;
	}

	public toJSON(): APIActionRowComponent {
		return {
			...this,
			components: this.components.map((component) => component.toJSON()),
		};
	}
}

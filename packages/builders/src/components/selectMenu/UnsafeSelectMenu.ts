import { ComponentType, type APISelectMenuComponent } from 'discord-api-types/v9';
import type { Component } from '../Component';
import { SelectMenuOption } from './SelectMenuOption';

/**
 * Represents a non-validated select menu component
 */
export class UnsafeSelectMenuComponent implements Component {
	public readonly type = ComponentType.SelectMenu as const;
	public readonly options: SelectMenuOption[];
	public readonly placeholder?: string;
	public readonly min_values?: number;
	public readonly max_values?: number;
	public readonly custom_id!: string;
	public readonly disabled?: boolean;

	public constructor(data?: APISelectMenuComponent) {
		this.options = data?.options.map((option) => new SelectMenuOption(option)) ?? [];
		this.placeholder = data?.placeholder;
		this.min_values = data?.min_values;
		this.max_values = data?.max_values;
		/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
		this.custom_id = data?.custom_id as string;
		/* eslint-enable @typescript-eslint/non-nullable-type-assertion-style */
		this.disabled = data?.disabled;
	}

	/**
	 * Sets the placeholder for this select menu
	 * @param placeholder The placeholder to use for this select menu
	 */
	public setPlaceholder(placeholder: string) {
		Reflect.set(this, 'placeholder', placeholder);
		return this;
	}

	/**
	 * Sets thes minimum values that must be selected in the select menu
	 * @param minValues The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		Reflect.set(this, 'min_values', minValues);
		return this;
	}

	/**
	 * Sets thes maximum values that must be selected in the select menu
	 * @param minValues The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		Reflect.set(this, 'max_values', maxValues);
		return this;
	}

	/**
	 * Sets the custom Id for this select menu
	 * @param customId The custom ID to use for this select menu
	 */
	public setCustomId(customId: string) {
		Reflect.set(this, 'custom_id', customId);
		return this;
	}

	/**
	 * Sets whether or not this select menu is disabled
	 * @param disabled Whether or not this select menu is disabled
	 */
	public setDisabled(disabled: boolean) {
		Reflect.set(this, 'disabled', disabled);
		return this;
	}

	/**
	 * Adds options to this select menu
	 * @param options The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: SelectMenuOption[]) {
		this.options.push(...options);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 * @param options The options to set on this select menu
	 */
	public setOptions(options: SelectMenuOption[]) {
		Reflect.set(this, 'options', [...options]);
		return this;
	}

	public toJSON(): APISelectMenuComponent {
		return {
			...this,
			options: this.options.map((option) => option.toJSON()),
		};
	}
}

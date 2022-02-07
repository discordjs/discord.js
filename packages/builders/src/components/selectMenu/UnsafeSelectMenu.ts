import { APISelectMenuOption, ComponentType, type APISelectMenuComponent } from 'discord-api-types/v9';
import { Component } from '../Component';
import { UnsafeSelectMenuOption } from './UnsafeSelectMenuOption';

export interface SelectMenuComponentData extends Omit<APISelectMenuComponent, 'type' | 'options'> {
	type?: ComponentType.SelectMenu;
	options?: APISelectMenuOption[];
}

/**
 * Represents a non-validated select menu component
 */
export class UnsafeSelectMenuComponent extends Component<Omit<APISelectMenuComponent, 'options'>> {
	public readonly options: UnsafeSelectMenuOption[];

	public constructor(data?: SelectMenuComponentData) {
		// We don't destructure directly in the constructor because it can't properly
		// handle possibly-undefined data, which causes invalid destructure runtime errors.
		if (data?.options) {
			const { options, ...initData } = data;
			super({ type: ComponentType.SelectMenu, ...initData });
		} else {
			super({ type: ComponentType.SelectMenu, ...data! });
		}

		this.options = data?.options?.map((o) => new UnsafeSelectMenuOption(o)) ?? [];
	}

	public get type(): ComponentType.SelectMenu {
		return this.data.type;
	}

	public get placeholder() {
		return this.data.placeholder;
	}

	public get maxValues() {
		return this.data.max_values;
	}

	public get minValues() {
		return this.data.min_values;
	}

	public get customId() {
		return this.data.custom_id;
	}

	public get disabled() {
		return this.data.disabled;
	}

	/**
	 * Sets the placeholder for this select menu
	 * @param placeholder The placeholder to use for this select menu
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu
	 * @param minValues The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minValues;
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu
	 * @param minValues The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = maxValues;
		return this;
	}

	/**
	 * Sets the custom Id for this select menu
	 * @param customId The custom ID to use for this select menu
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets whether or not this select menu is disabled
	 * @param disabled Whether or not this select menu is disabled
	 */
	public setDisabled(disabled: boolean) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * Adds options to this select menu
	 * @param options The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: UnsafeSelectMenuOption[]) {
		this.options.push(...options);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 * @param options The options to set on this select menu
	 */
	public setOptions(options: UnsafeSelectMenuOption[]) {
		this.options.splice(0, this.options.length, ...options);
		return this;
	}

	public toJSON(): APISelectMenuComponent {
		return {
			...this.data,
			options: this.options.map((o) => o.toJSON()),
		};
	}
}

import { APISelectMenuOption, ComponentType, type APISelectMenuComponent } from 'discord-api-types/v10';
import { UnsafeSelectMenuOptionBuilder } from './UnsafeSelectMenuOption';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';
import { ComponentBuilder } from '../Component';

/**
 * Represents a non-validated select menu component
 */
export class UnsafeSelectMenuBuilder extends ComponentBuilder<APISelectMenuComponent> {
	/**
	 * The options within this select menu
	 */
	public readonly options: UnsafeSelectMenuOptionBuilder[];

	public constructor(data?: Partial<APISelectMenuComponent>) {
		const { options, ...initData } = data ?? {};
		super({ type: ComponentType.SelectMenu, ...initData });
		this.options = options?.map((o) => new UnsafeSelectMenuOptionBuilder(o)) ?? [];
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
	 * @param customId The custom id to use for this select menu
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets whether or not this select menu is disabled
	 * @param disabled Whether or not this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * Adds options to this select menu
	 * @param options The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: RestOrArray<UnsafeSelectMenuOptionBuilder | APISelectMenuOption>) {
		this.options.push(
			...normalizeArray(options).map((option) =>
				option instanceof UnsafeSelectMenuOptionBuilder ? option : new UnsafeSelectMenuOptionBuilder(option),
			),
		);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 * @param options The options to set on this select menu
	 */
	public setOptions(...options: RestOrArray<UnsafeSelectMenuOptionBuilder | APISelectMenuOption>) {
		this.options.splice(
			0,
			this.options.length,
			...normalizeArray(options).map((option) =>
				option instanceof UnsafeSelectMenuOptionBuilder ? option : new UnsafeSelectMenuOptionBuilder(option),
			),
		);
		return this;
	}

	public toJSON(): APISelectMenuComponent {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
			options: this.options.map((o) => o.toJSON()),
		} as APISelectMenuComponent;
	}
}

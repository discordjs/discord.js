import type { APISelectMenuComponent } from 'discord-api-types/v10';
import { customIdValidator, disabledValidator, minMaxValidator, placeholderValidator } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';

/**
 * The base select menu builder that contains common symbols for select menu builders.
 *
 * @typeParam SelectMenuType - The type of select menu this would be instantiated for.
 */
export abstract class BaseSelectMenuBuilder<
	SelectMenuType extends APISelectMenuComponent,
> extends ComponentBuilder<SelectMenuType> {
	/**
	 * Sets the placeholder for this select menu.
	 *
	 * @param placeholder - The placeholder to use
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholderValidator.parse(placeholder);
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu.
	 *
	 * @param minValues - The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minMaxValidator.parse(minValues);
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu.
	 *
	 * @param maxValues - The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = minMaxValidator.parse(maxValues);
		return this;
	}

	/**
	 * Sets the custom id for this select menu.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets whether this select menu is disabled.
	 *
	 * @param disabled - Whether this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabledValidator.parse(disabled);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): SelectMenuType {
		customIdValidator.parse(this.data.custom_id);
		return {
			...this.data,
		} as SelectMenuType;
	}
}

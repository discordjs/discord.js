import type { APISelectMenuComponent } from 'discord-api-types/v10';
import { parse } from '../../util/validation.js';
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
		this.data.placeholder = parse(placeholderValidator, placeholder);
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu.
	 *
	 * @param minValues - The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = parse(minMaxValidator, minValues);
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu.
	 *
	 * @param maxValues - The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = parse(minMaxValidator, maxValues);
		return this;
	}

	/**
	 * Sets the custom id for this select menu.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = parse(customIdValidator, customId);
		return this;
	}

	/**
	 * Sets whether this select menu is disabled.
	 *
	 * @param disabled - Whether this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = parse(disabledValidator, disabled);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): SelectMenuType {
		parse(customIdValidator, this.data.custom_id);
		return {
			...this.data,
		} as SelectMenuType;
	}
}

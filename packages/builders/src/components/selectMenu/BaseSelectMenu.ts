import type { APISelectMenuComponent } from 'discord-api-types/v10';
import { customIdValidator, disabledValidator, minMaxValidator, placeholderValidator } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';

export class BaseSelectMenu extends ComponentBuilder<APISelectMenuComponent> {
	/**
	 * Sets the placeholder for this select menu
	 *
	 * @param placeholder - The placeholder to use for this select menu
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholderValidator.parse(placeholder);
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu
	 *
	 * @param minValues - The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minMaxValidator.parse(minValues);
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu
	 *
	 * @param maxValues - The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = minMaxValidator.parse(maxValues);
		return this;
	}

	/**
	 * Sets the custom id for this select menu
	 *
	 * @param customId - The custom id to use for this select menu
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets whether this select menu is disabled
	 *
	 * @param disabled - Whether this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabledValidator.parse(disabled);
		return this;
	}

	public toJSON(): APISelectMenuComponent {
		customIdValidator.parse(this.data.custom_id);
		return {
			...this.data,
		} as APISelectMenuComponent;
	}
}

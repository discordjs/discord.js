import type { JSONEncodable } from '@discordjs/util';
import type { APISelectMenuComponent } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component.js';

/**
 * The base select menu builder that contains common symbols for select menu builders.
 *
 * @typeParam SelectMenuType - The type of select menu this would be instantiated for.
 */
export abstract class BaseSelectMenuBuilder<Data extends APISelectMenuComponent>
	extends ComponentBuilder<Data>
	implements JSONEncodable<APISelectMenuComponent>
{
	protected abstract readonly data: Partial<
		Pick<Data, 'custom_id' | 'disabled' | 'max_values' | 'min_values' | 'placeholder'>
	>;

	/**
	 * Sets the placeholder for this select menu.
	 *
	 * @param placeholder - The placeholder to use
	 */
	public setPlaceholder(placeholder: string) {
		this.data.placeholder = placeholder;
		return this;
	}

	/**
	 * Clears the placeholder for this select menu.
	 */
	public clearPlaceholder() {
		this.data.placeholder = undefined;
		return this;
	}

	/**
	 * Sets the minimum values that must be selected in the select menu.
	 *
	 * @param minValues - The minimum values that must be selected
	 */
	public setMinValues(minValues: number) {
		this.data.min_values = minValues;
		return this;
	}

	/**
	 * Sets the maximum values that must be selected in the select menu.
	 *
	 * @param maxValues - The maximum values that must be selected
	 */
	public setMaxValues(maxValues: number) {
		this.data.max_values = maxValues;
		return this;
	}

	/**
	 * Sets the custom id for this select menu.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Sets whether this select menu is disabled.
	 *
	 * @param disabled - Whether this select menu is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}
}

import { ComponentType, type APISelectMenuComponent, type APISelectMenuOption } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import {
	customIdValidator,
	disabledValidator,
	jsonOptionValidator,
	minMaxValidator,
	optionsLengthValidator,
	placeholderValidator,
	validateRequiredSelectMenuParameters,
} from '../Assertions.js';
import { BaseSelectMenu } from './BaseSelectMenu.js';
import { SelectMenuOptionBuilder } from './SelectMenuOption.js';


export class MentionableSelectMenuBuilder extends BaseSelectMenu {

	/**
	 * Creates a new select menu from API data
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object
	 * ```ts
	 * const selectMenu = new MentionableSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data
	 * ```ts
	 * const selectMenu = new MentionableSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1)
	 * ```
	 */
	public constructor(data?: Partial<APISelectMenuComponent>) {
		super({ type: ComponentType.MentionableSelect, ...data });
	}



}

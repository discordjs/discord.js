import type { APIStringSelectComponent } from 'discord-api-types/v10';
import { ComponentType, type APISelectMenuOption } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { jsonOptionValidator, optionsLengthValidator, validateRequiredSelectMenuParameters } from '../Assertions.js';
import { BaseSelectMenuBuilder } from './BaseSelectMenu.js';
import { StringSelectMenuOptionBuilder } from './StringSelectMenuOption.js';

/**
 * Represents a string select menu component
 */
export class StringSelectMenuBuilder extends BaseSelectMenuBuilder<APIStringSelectComponent> {
	/**
	 * The options within this select menu
	 */
	public readonly options: StringSelectMenuOptionBuilder[];

	/**
	 * Creates a new select menu from API data
	 *
	 * @param data - The API data to create this select menu with
	 * @example
	 * Creating a select menu from an API data object
	 * ```ts
	 * const selectMenu = new StringSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * 	placeholder: 'select an option',
	 * 	max_values: 2,
	 * 	options: [
	 * 		{ label: 'option 1', value: '1' },
	 * 		{ label: 'option 2', value: '2' },
	 * 		{ label: 'option 3', value: '3' },
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a select menu using setters and API data
	 * ```ts
	 * const selectMenu = new StringSelectMenuBuilder({
	 * 	custom_id: 'a cool select menu',
	 * })
	 * 	.setMinValues(1)
	 * 	.addOptions({
	 * 		label: 'Catchy',
	 * 		value: 'catch',
	 * 	});
	 * ```
	 */
	public constructor(data?: Partial<APIStringSelectComponent>) {
		const { options, ...initData } = data ?? {};
		super({ ...initData, type: ComponentType.StringSelect });
		this.options = options?.map((option: APISelectMenuOption) => new StringSelectMenuOptionBuilder(option)) ?? [];
	}

	/**
	 * Adds options to this select menu
	 *
	 * @param options - The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: RestOrArray<APISelectMenuOption | StringSelectMenuOptionBuilder>) {
		// eslint-disable-next-line no-param-reassign
		options = normalizeArray(options);
		optionsLengthValidator.parse(this.options.length + options.length);
		this.options.push(
			...options.map((option) =>
				option instanceof StringSelectMenuOptionBuilder
					? option
					: new StringSelectMenuOptionBuilder(jsonOptionValidator.parse(option)),
			),
		);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 *
	 * @param options - The options to set on this select menu
	 */
	public setOptions(...options: RestOrArray<APISelectMenuOption | StringSelectMenuOptionBuilder>) {
		// eslint-disable-next-line no-param-reassign
		options = normalizeArray(options);
		optionsLengthValidator.parse(options.length);
		this.options.splice(
			0,
			this.options.length,
			...options.map((option) =>
				option instanceof StringSelectMenuOptionBuilder
					? option
					: new StringSelectMenuOptionBuilder(jsonOptionValidator.parse(option)),
			),
		);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APIStringSelectComponent {
		validateRequiredSelectMenuParameters(this.options, this.data.custom_id);

		return {
			...this.data,
			options: this.options.map((option) => option.toJSON()),
		} as APIStringSelectComponent;
	}
}

import { ComponentType, type APISelectMenuComponent, type APISelectMenuOption } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { jsonOptionValidator, optionsLengthValidator, validateRequiredSelectMenuParameters } from '../Assertions.js';
import { BaseSelectMenu } from './BaseSelectMenu.js';
import { SelectMenuOptionBuilder } from './SelectMenuOption.js';

export class StringSelectMenuBuilder extends BaseSelectMenu {
	/**
	 * The options within this select menu
	 */
	public readonly options: SelectMenuOptionBuilder[];

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
	public constructor(data?: Partial<APISelectMenuComponent>) {
		const { options, ...initData } = data ?? {};
		super({ ...initData, type: ComponentType.StringSelect });
		this.options = options?.map((option: APISelectMenuOption) => new SelectMenuOptionBuilder(option)) ?? [];
	}

	/**
	 * Adds options to this select menu
	 *
	 * @param options - The options to add to this select menu
	 * @returns
	 */
	public addOptions(...options: RestOrArray<APISelectMenuOption | SelectMenuOptionBuilder>) {
		// eslint-disable-next-line no-param-reassign
		options = normalizeArray(options);
		optionsLengthValidator.parse(this.options.length + options.length);
		this.options.push(
			...options.map((option) =>
				option instanceof SelectMenuOptionBuilder
					? option
					: new SelectMenuOptionBuilder(jsonOptionValidator.parse(option)),
			),
		);
		return this;
	}

	/**
	 * Sets the options on this select menu
	 *
	 * @param options - The options to set on this select menu
	 */
	public setOptions(...options: RestOrArray<APISelectMenuOption | SelectMenuOptionBuilder>) {
		// eslint-disable-next-line no-param-reassign
		options = normalizeArray(options);
		optionsLengthValidator.parse(options.length);
		this.options.splice(
			0,
			this.options.length,
			...options.map((option) =>
				option instanceof SelectMenuOptionBuilder
					? option
					: new SelectMenuOptionBuilder(jsonOptionValidator.parse(option)),
			),
		);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APISelectMenuComponent {
		validateRequiredSelectMenuParameters(this.options, this.data.custom_id);

		return {
			...this.data,
			options: this.options.map((option) => option.toJSON()),
		} as APISelectMenuComponent;
	}
}

/**
 * @deprecated Use {@link StringSelectMenuBuilder} instead.
 */
export const SelectMenuBuilder = StringSelectMenuBuilder;

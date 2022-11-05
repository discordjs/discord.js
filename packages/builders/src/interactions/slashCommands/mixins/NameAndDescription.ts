import type {
	LocaleString,
	LocalizationMap,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	APIApplicationCommandBasicOption,
	APIApplicationCommandSubcommandGroupOption,
} from 'discord-api-types/v10';
import { validateDescription, validateLocale, validateName } from '../Assertions.js';
import type { SlashCommandBuilder } from '../SlashCommandBuilder.js';
import type { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

export class SharedNameAndDescription<
	T extends APIApplicationCommandSubcommandGroupOption | ApplicationCommandOptionBase | SlashCommandBuilder =
		| APIApplicationCommandSubcommandGroupOption
		| ApplicationCommandOptionBase
		| SlashCommandBuilder,
> {
	public readonly data: Partial<
		T extends ApplicationCommandOptionBase
			? APIApplicationCommandBasicOption
			: T extends SlashCommandBuilder
			? RESTPostAPIChatInputApplicationCommandsJSONBody
			: T extends APIApplicationCommandSubcommandGroupOption
			? APIApplicationCommandSubcommandGroupOption
			: APIApplicationCommandBasicOption | RESTPostAPIChatInputApplicationCommandsJSONBody
	> = {};

	/**
	 * Sets the name
	 *
	 * @param name - The name
	 */
	public setName(name: string): this {
		// Assert the name matches the conditions
		validateName(name);

		this.data.name = name;

		return this;
	}

	/**
	 * Sets the description
	 *
	 * @param description - The description
	 */
	public setDescription(description: string) {
		// Assert the description matches the conditions
		validateDescription(description);

		this.data.description = description;

		return this;
	}

	/**
	 * Sets a name localization
	 *
	 * @param locale - The locale to set a description for
	 * @param localizedName - The localized description for the given locale
	 */
	public setNameLocalization(locale: LocaleString, localizedName: string | null) {
		if (!this.data.name_localizations) {
			this.data.name_localizations = {};
		}

		const parsedLocale = validateLocale(locale);

		if (localizedName === null) {
			this.data.name_localizations![parsedLocale] = null;
			return this;
		}

		validateName(localizedName);

		this.data.name_localizations![parsedLocale] = localizedName;
		return this;
	}

	/**
	 * Sets the name localizations
	 *
	 * @param localizedNames - The dictionary of localized descriptions to set
	 */
	public setNameLocalizations(localizedNames: LocalizationMap | null) {
		if (localizedNames === null) {
			this.data.name_localizations = null;
			return this;
		}

		this.data.name_localizations = {};

		for (const args of Object.entries(localizedNames)) {
			this.setNameLocalization(...(args as [LocaleString, string | null]));
		}

		return this;
	}

	/**
	 * Sets a description localization
	 *
	 * @param locale - The locale to set a description for
	 * @param localizedDescription - The localized description for the given locale
	 */
	public setDescriptionLocalization(locale: LocaleString, localizedDescription: string | null) {
		if (!this.data.description_localizations) {
			this.data.description_localizations = {};
		}

		const parsedLocale = validateLocale(locale);

		if (localizedDescription === null) {
			this.data.description_localizations![parsedLocale] = null;
			return this;
		}

		validateDescription(localizedDescription);

		this.data.description_localizations![parsedLocale] = localizedDescription;
		return this;
	}

	/**
	 * Sets the description localizations
	 *
	 * @param localizedDescriptions - The dictionary of localized descriptions to set
	 */
	public setDescriptionLocalizations(localizedDescriptions: LocalizationMap | null) {
		if (localizedDescriptions === null) {
			this.data.description_localizations = null;
			return this;
		}

		this.data.description_localizations = {};
		for (const args of Object.entries(localizedDescriptions)) {
			this.setDescriptionLocalization(...(args as [LocaleString, string | null]));
		}

		return this;
	}
}

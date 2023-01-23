import type { LocaleString, LocalizationMap } from 'discord-api-types/v10';
import { validateDescription, validateLocale, validateName } from '../Assertions.js';

export class SharedNameAndDescription {
	public readonly name!: string;

	public readonly nameLocalizations?: LocalizationMap;

	public readonly description!: string;

	public readonly descriptionLocalizations?: LocalizationMap;

	/**
	 * Sets the name
	 *
	 * @param name - The name
	 */
	public setName(name: string): this {
		// Assert the name matches the conditions
		validateName(name);

		Reflect.set(this, 'name', name);

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

		Reflect.set(this, 'description', description);

		return this;
	}

	/**
	 * Sets a name localization
	 *
	 * @param locale - The locale to set a description for
	 * @param localizedName - The localized description for the given locale
	 */
	public setNameLocalization(locale: LocaleString, localizedName: string | null) {
		if (!this.nameLocalizations) {
			Reflect.set(this, 'nameLocalizations', {});
		}

		const parsedLocale = validateLocale(locale);

		if (localizedName === null) {
			this.nameLocalizations![parsedLocale] = null;
			return this;
		}

		validateName(localizedName);

		this.nameLocalizations![parsedLocale] = localizedName;
		return this;
	}

	/**
	 * Sets the name localizations
	 *
	 * @param localizedNames - The dictionary of localized descriptions to set
	 */
	public setNameLocalizations(localizedNames: LocalizationMap | null) {
		if (localizedNames === null) {
			Reflect.set(this, 'nameLocalizations', null);
			return this;
		}

		Reflect.set(this, 'nameLocalizations', {});

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
		if (!this.descriptionLocalizations) {
			Reflect.set(this, 'descriptionLocalizations', {});
		}

		const parsedLocale = validateLocale(locale);

		if (localizedDescription === null) {
			this.descriptionLocalizations![parsedLocale] = null;
			return this;
		}

		validateDescription(localizedDescription);

		this.descriptionLocalizations![parsedLocale] = localizedDescription;
		return this;
	}

	/**
	 * Sets the description localizations
	 *
	 * @param localizedDescriptions - The dictionary of localized descriptions to set
	 */
	public setDescriptionLocalizations(localizedDescriptions: LocalizationMap | null) {
		if (localizedDescriptions === null) {
			Reflect.set(this, 'descriptionLocalizations', null);
			return this;
		}

		Reflect.set(this, 'descriptionLocalizations', {});
		for (const args of Object.entries(localizedDescriptions)) {
			this.setDescriptionLocalization(...(args as [LocaleString, string | null]));
		}

		return this;
	}
}

import type { LocaleString, LocalizationMap } from 'discord-api-types/v10';
import { flattenLocaleMap } from '../../../util/slashCommandUtil';
import { validateDescription, validateLocale, validateName } from '../Assertions';

export class SharedNameAndDescription {
	public readonly name!: string;
	public readonly name_localizations?: LocalizationMap;
	public readonly description!: string;
	public readonly description_localizations?: LocalizationMap;

	/**
	 * Sets the name
	 *
	 * @param name The name
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
	 * @param description The description
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
	 * @param locale The locale to set a description for
	 * @param localizedName The localized description for the given locale
	 */
	public setNameLocalization(locale: LocaleString, localizedName: string | null) {
		if (!this.name_localizations) {
			Reflect.set(this, 'name_localizations', {});
		}

		validateLocale(locale);

		if (localizedName === null) {
			this.name_localizations![locale] = null;
			return this;
		}

		validateName(localizedName);

		this.name_localizations![locale] = localizedName;
		return this;
	}

	/**
	 * Sets the name localizations
	 *
	 * @param localizedNames The dictionary of localized descriptions to set
	 */
	public setNameLocalizations(localizedNames: Map<LocaleString, string> | LocalizationMap | null) {
		if (localizedNames === null) {
			Reflect.set(this, 'name_localizations', null);
			return this;
		}

		Reflect.set(this, 'name_localizations', {});
		flattenLocaleMap(localizedNames).forEach((args) => this.setNameLocalization(...args));
		return this;
	}

	/**
	 * Sets a description localization
	 *
	 * @param locale The locale to set a description for
	 * @param localizedDescription The localized description for the given locale
	 */
	public setDescriptionLocalization(locale: LocaleString, localizedDescription: string | null) {
		if (!this.description_localizations) {
			Reflect.set(this, 'description_localizations', {});
		}

		validateLocale(locale);

		if (localizedDescription === null) {
			this.description_localizations![locale] = null;
			return this;
		}

		validateDescription(localizedDescription);

		this.description_localizations![locale] = localizedDescription;
		return this;
	}

	/**
	 * Sets the description localizations
	 *
	 * @param localizedDescriptions The dictionary of localized descriptions to set
	 */
	public setDescriptionLocalizations(
		localizedDescriptions: Map<LocaleString, string> | Partial<Record<LocaleString, string>> | null,
	) {
		if (localizedDescriptions === null) {
			Reflect.set(this, 'description_localizations', null);
			return this;
		}

		Reflect.set(this, 'description_localizations', {});
		flattenLocaleMap(localizedDescriptions).forEach((args) => this.setDescriptionLocalization(...args));
		return this;
	}
}

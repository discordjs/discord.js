import type { LocaleString } from 'discord-api-types/v10';
import { flattenLocaleMap } from '../../../util/slashCommandUtil';
import { validateDescription, validateLocale, validateName } from '../Assertions';

export class SharedNameAndDescription {
	public readonly name!: string;
	public readonly nameLocalizations?: Partial<Record<LocaleString, string>> = undefined;
	public readonly description!: string;
	public readonly descriptionLocalizations?: Partial<Record<LocaleString, string>> = undefined;

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
	public setNameLocalization(locale: LocaleString, localizedName: string) {
		validateLocale(locale);
		validateName(localizedName);

		if (!this.nameLocalizations) {
			Reflect.set(this, 'nameLocalizations', {});
		}

		this.nameLocalizations![locale] = localizedName;
		return this;
	}

	/**
	 * Sets the name localizations
	 *
	 * @param localizedNames The dictionary of localized descriptions to set
	 */
	public setNameLocalizations(
		localizedNames: Partial<Record<LocaleString, string>> | Map<LocaleString, string> | null,
	) {
		if (localizedNames === null) {
			Reflect.set(this, 'nameLocalizations', undefined);
			return this;
		}

		Reflect.set(this, 'nameLocalizations', {});
		flattenLocaleMap(localizedNames).forEach((args) => this.setNameLocalization(...args));
		return this;
	}

	/**
	 * Sets a description localization
	 *
	 * @param locale The locale to set a description for
	 * @param localizedDescription The localized description for the given locale
	 */
	public setDescriptionLocalization(locale: LocaleString, localizedDescription: string) {
		validateLocale(locale);
		validateDescription(localizedDescription);

		if (!this.descriptionLocalizations) {
			Reflect.set(this, 'descriptionLocalizations', {});
		}

		this.descriptionLocalizations![locale] = localizedDescription;
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
			Reflect.set(this, 'descriptionLocalizations', undefined);
			return this;
		}

		Reflect.set(this, 'descriptionLocalizations', {});
		flattenLocaleMap(localizedDescriptions).forEach((args) => this.setDescriptionLocalization(...args));
		return this;
	}
}

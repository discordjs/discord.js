import type { LocaleString, RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export interface SharedNameData
	extends Partial<Pick<RESTPostAPIApplicationCommandsJSONBody, 'name_localizations' | 'name'>> {}

/**
 * This mixin holds name and description symbols for chat input commands.
 */
export class SharedName {
	protected readonly data: SharedNameData = {};

	/**
	 * Sets the name of this command.
	 *
	 * @param name - The name to use
	 */
	public setName(name: string): this {
		this.data.name = name;
		return this;
	}

	/**
	 * Sets a name localization for this command.
	 *
	 * @param locale - The locale to set
	 * @param localizedName - The localized name for the given `locale`
	 */
	public setNameLocalization(locale: LocaleString, localizedName: string) {
		this.data.name_localizations ??= {};
		this.data.name_localizations[locale] = localizedName;

		return this;
	}

	/**
	 * Clears a name localization for this command.
	 *
	 * @param locale - The locale to clear
	 */
	public clearNameLocalization(locale: LocaleString) {
		this.data.name_localizations ??= {};
		this.data.name_localizations[locale] = undefined;

		return this;
	}

	/**
	 * Sets the name localizations for this command.
	 *
	 * @param localizedNames - The object of localized names to set
	 */
	public setNameLocalizations(localizedNames: Partial<Record<LocaleString, string>>) {
		this.data.name_localizations = structuredClone(localizedNames);
		return this;
	}

	/**
	 * Clears all name localizations for this command.
	 */
	public clearNameLocalizations() {
		this.data.name_localizations = undefined;
		return this;
	}
}

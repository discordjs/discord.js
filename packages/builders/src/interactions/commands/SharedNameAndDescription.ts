import type { APIApplicationCommand, LocaleString } from 'discord-api-types/v10';
import type { SharedNameData } from './SharedName.js';
import { SharedName } from './SharedName.js';

export interface SharedNameAndDescriptionData
	extends SharedNameData,
		Partial<Pick<APIApplicationCommand, 'description_localizations' | 'description'>> {}

/**
 * This mixin holds name and description symbols for chat input commands.
 */
export class SharedNameAndDescription extends SharedName {
	protected override readonly data: SharedNameAndDescriptionData = {};

	/**
	 * Sets the description of this command.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Sets a description localization for this command.
	 *
	 * @param locale - The locale to set
	 * @param localizedDescription - The localized description for the given `locale`
	 */
	public setDescriptionLocalization(locale: LocaleString, localizedDescription: string) {
		this.data.description_localizations ??= {};
		this.data.description_localizations[locale] = localizedDescription;

		return this;
	}

	/**
	 * Clears a description localization for this command.
	 *
	 * @param locale - The locale to clear
	 */
	public clearDescriptionLocalization(locale: LocaleString) {
		this.data.description_localizations ??= {};
		this.data.description_localizations[locale] = undefined;

		return this;
	}

	/**
	 * Sets the description localizations for this command.
	 *
	 * @param localizedDescriptions - The object of localized descriptions to set
	 */
	public setDescriptionLocalizations(localizedDescriptions: Partial<Record<LocaleString, string>>) {
		this.data.description_localizations = structuredClone(localizedDescriptions);
		return this;
	}

	/**
	 * Clears all description localizations for this command.
	 */
	public clearDescriptionLocalizations() {
		this.data.description_localizations = undefined;
		return this;
	}
}

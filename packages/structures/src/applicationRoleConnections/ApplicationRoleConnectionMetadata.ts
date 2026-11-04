import type { APIApplicationRoleConnectionMetadata } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents an application's role connection metadata field on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The `name_localizations` and `description_localizations` fields are retained as raw locale dictionaries.
 * @see {@link https://docs.discord.com/developers/resources/application-role-connection-metadata#application-role-connection-metadata-object}
 */
export class ApplicationRoleConnectionMetadata<
	Omitted extends keyof APIApplicationRoleConnectionMetadata | '' = '',
> extends Structure<APIApplicationRoleConnectionMetadata, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each application role connection metadata field
	 */
	public static override readonly DataTemplate: Partial<APIApplicationRoleConnectionMetadata> = {};

	/**
	 * @param data - The raw data received from the API for the application role connection metadata field
	 */
	public constructor(data: Partialize<APIApplicationRoleConnectionMetadata, Omitted>) {
		super(data);
	}

	/**
	 * The type of comparison used for this metadata field
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The dictionary key for this metadata field (1-50 lowercase letters, digits, or underscores)
	 */
	public get key() {
		return this[kData].key;
	}

	/**
	 * The name of this metadata field (1-100 characters)
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Translations of this metadata field's name
	 */
	public get nameLocalizations() {
		return this[kData].name_localizations;
	}

	/**
	 * The description of this metadata field (1-200 characters)
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * Translations of this metadata field's description
	 */
	public get descriptionLocalizations() {
		return this[kData].description_localizations;
	}
}

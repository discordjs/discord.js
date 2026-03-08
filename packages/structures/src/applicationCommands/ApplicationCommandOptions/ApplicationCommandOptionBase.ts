import type { APIApplicationCommandOptionBase, ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any application command option on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks required options must be listed before optional options
 */
export abstract class ApplicationCommandOptionBase<
	CommandOptionType extends ApplicationCommandOptionType,
	Omitted extends keyof APIApplicationCommandOptionBase<CommandOptionType> | '' = '',
> extends Structure<APIApplicationCommandOptionBase<CommandOptionType>, Omitted> {
	/**
	 * @param data - The raw data received from the API for the application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandOptionBase<CommandOptionType>, Omitted>) {
		super(data);
	}

	/**
	 * Type of this option
	 *
	 * @remarks Valid option types: ALL
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type}
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * 1-32 character name.
	 *
	 * @remarks Must be unique within an array of application command options.
	 * @remarks Valid option types: ALL
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming}
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Localization map for the `name` field.
	 *
	 * @remarks Values follow the same restrictions as `name`.
	 * @remarks Valid option types: ALL
	 * @see {@link https://discord.com/developers/docs/reference#locales}
	 */
	public get nameLocalizations() {
		return this[kData].name_localizations;
	}

	/**
	 * 1-100 character description
	 *
	 * @remarks Valid option types: ALL
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * Localization map for the `description` field.
	 *
	 * @remarks Values follow the same restrictions as `description`.
	 * @remarks Valid option types: ALL
	 * @see {@link https://discord.com/developers/docs/reference#locales}
	 */
	public get descriptionLocalizations() {
		return this[kData].description_localizations;
	}

	/**
	 * Whether the parameter is required or optional
	 *
	 * @remarks Valid option types: All except {@link ApplicationCommandOptionType.Subcommand | Subcommand}, {@link ApplicationCommandOptionType.SubcommandGroup | SubcommandGroup}
	 * @defaultValue `false`
	 */
	public get required() {
		return this[kData].required;
	}
}

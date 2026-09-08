import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIApplicationCommand, ApplicationCommandType } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any application command on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `User` which needs to be instantiated and stored by an extending class using it
 * @remarks intentionally does not export `roles` so that extending classes can resolve `Snowflake[]` to `Role[]`
 */
export class ApplicationCommand<Omitted extends keyof APIApplicationCommand | '' = ''> extends Structure<
	APIApplicationCommand,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each application command
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommand> = {};

	/**
	 * @param data - The raw data received from the API for the application command
	 */
	public constructor(data: Partialize<APIApplicationCommand, Omitted>) {
		super(data);
	}

	/**
	 * Unique ID of command
	 *
	 * @remarks Valid option types: ALL
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * Type of command
	 *
	 * @remarks Valid option types: ALL
	 * @defaultValue {@link ApplicationCommandType.ChatInput}
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * Id of the parent application
	 *
	 * @remarks Valid option types: ALL
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * Guild ID of the command, if not global
	 *
	 * @remarks Valid option types: ALL
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * Name of the application, 1-32 characters
	 *
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
	 * Description for {@link ApplicationCommandType.ChatInput} commands, 1-100 characters.
	 * Empty string for {@link ApplicationCommandType.User} and {@link ApplicationCommandType.Message} commands.
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
	 * Set of permissions represented as a bit set
	 *
	 * @see {@link https://discord.com/developers/docs/topics/permissions}
	 */
	public get defaultMemberPermissions() {
		return this[kData].default_member_permissions;
	}

	/**
	 * Whether the command is age-restricted (NSFW)
	 *
	 * @defaultValue `false`
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#agerestricted-commands}
	 */
	public get nsfw() {
		return this[kData].nsfw;
	}

	/**
	 * The timestamp the command was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the command was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}

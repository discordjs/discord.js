import type {
	ApplicationCommandType,
	LocaleString,
	LocalizationMap,
	Permissions,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { validateLocale, validateLocalizationMap } from '../slashCommands/Assertions.js';
import {
	validateRequiredParameters,
	validateName,
	validateType,
	validateDefaultPermission,
	validateDefaultMemberPermissions,
	validateDMPermission,
} from './Assertions.js';

export class ContextMenuCommandBuilder {
	public readonly data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody> = {};

	/**
	 * Sets the name
	 *
	 * @param name - The name
	 */
	public setName(name: string) {
		// Assert the name matches the conditions
		validateName(name);

		this.data.name = name;

		return this;
	}

	/**
	 * Sets the type
	 *
	 * @param type - The type
	 */
	public setType(type: ContextMenuCommandType) {
		// Assert the type is valid
		validateType(type);

		this.data.type = type;

		return this;
	}

	/**
	 * Sets whether the command is enabled by default when the application is added to a guild.
	 *
	 * @remarks
	 * If set to `false`, you will have to later `PUT` the permissions for this command.
	 * @param value - Whether or not to enable this command by default
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 * @deprecated Use {@link ContextMenuCommandBuilder.setDefaultMemberPermissions} or {@link ContextMenuCommandBuilder.setDMPermission} instead.
	 */
	public setDefaultPermission(value: boolean) {
		// Assert the value matches the conditions
		validateDefaultPermission(value);

		this.data.default_permission = value;

		return this;
	}

	/**
	 * Sets the default permissions a member should have in order to run the command.
	 *
	 * @remarks
	 * You can set this to `'0'` to disable the command by default.
	 * @param permissions - The permissions bit field to set
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 */
	public setDefaultMemberPermissions(permissions: Permissions | bigint | number | null | undefined) {
		// Assert the value and parse it
		const permissionValue = validateDefaultMemberPermissions(permissions);

		this.data.default_member_permissions = permissionValue;

		return this;
	}

	/**
	 * Sets if the command is available in DMs with the application, only for globally-scoped commands.
	 * By default, commands are visible.
	 *
	 * @param enabled - If the command should be enabled in DMs
	 * @see https://discord.com/developers/docs/interactions/application-commands#permissions
	 */
	public setDMPermission(enabled: boolean | null | undefined) {
		// Assert the value matches the conditions
		validateDMPermission(enabled);

		this.data.dm_permission = enabled ?? undefined;

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

		for (const args of Object.entries(localizedNames))
			this.setNameLocalization(...(args as [LocaleString, string | null]));
		return this;
	}

	/**
	 * Returns the final data that should be sent to Discord.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		validateRequiredParameters(this.data);

		validateLocalizationMap(this.data.name_localizations);

		return { ...this.data };
	}
}

export type ContextMenuCommandType = ApplicationCommandType.Message | ApplicationCommandType.User;

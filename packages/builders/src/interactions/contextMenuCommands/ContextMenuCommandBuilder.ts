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

/**
 * The type a context menu command can be.
 */
export type ContextMenuCommandType = ApplicationCommandType.Message | ApplicationCommandType.User;

/**
 * A builder that creates API-compatible JSON data for context menu commands.
 */
export class ContextMenuCommandBuilder {
	/**
	 * The name of this command.
	 */
	public readonly name: string = undefined!;

	/**
	 * The name localizations of this command.
	 */
	public readonly name_localizations?: LocalizationMap;

	/**
	 * The type of this command.
	 */
	public readonly type: ContextMenuCommandType = undefined!;

	/**
	 * Whether this command is enabled by default when the application is added to a guild.
	 *
	 * @deprecated Use {@link ContextMenuCommandBuilder.setDefaultMemberPermissions} or {@link ContextMenuCommandBuilder.setDMPermission} instead.
	 */
	public readonly default_permission: boolean | undefined = undefined;

	/**
	 * The set of permissions represented as a bit set for the command.
	 */
	public readonly default_member_permissions: Permissions | null | undefined = undefined;

	/**
	 * Indicates whether the command is available in direct messages with the application.
	 *
	 * @remarks
	 * By default, commands are visible. This property is only for global commands.
	 */
	public readonly dm_permission: boolean | undefined = undefined;

	/**
	 * Sets the name of this command.
	 *
	 * @param name - The name to use
	 */
	public setName(name: string) {
		// Assert the name matches the conditions
		validateName(name);

		Reflect.set(this, 'name', name);

		return this;
	}

	/**
	 * Sets the type of this command.
	 *
	 * @param type - The type to use
	 */
	public setType(type: ContextMenuCommandType) {
		// Assert the type is valid
		validateType(type);

		Reflect.set(this, 'type', type);

		return this;
	}

	/**
	 * Sets whether the command is enabled by default when the application is added to a guild.
	 *
	 * @remarks
	 * If set to `false`, you will have to later `PUT` the permissions for this command.
	 * @param value - Whether to enable this command by default
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 * @deprecated Use {@link ContextMenuCommandBuilder.setDefaultMemberPermissions} or {@link ContextMenuCommandBuilder.setDMPermission} instead.
	 */
	public setDefaultPermission(value: boolean) {
		// Assert the value matches the conditions
		validateDefaultPermission(value);

		Reflect.set(this, 'default_permission', value);

		return this;
	}

	/**
	 * Sets the default permissions a member should have in order to run this command.
	 *
	 * @remarks
	 * You can set this to `'0'` to disable the command by default.
	 * @param permissions - The permissions bit field to set
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 */
	public setDefaultMemberPermissions(permissions: Permissions | bigint | number | null | undefined) {
		// Assert the value and parse it
		const permissionValue = validateDefaultMemberPermissions(permissions);

		Reflect.set(this, 'default_member_permissions', permissionValue);

		return this;
	}

	/**
	 * Sets if the command is available in direct messages with the application.
	 *
	 * @remarks
	 * By default, commands are visible. This method is only for global commands.
	 * @param enabled - Whether the command should be enabled in direct messages
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 */
	public setDMPermission(enabled: boolean | null | undefined) {
		// Assert the value matches the conditions
		validateDMPermission(enabled);

		Reflect.set(this, 'dm_permission', enabled);

		return this;
	}

	/**
	 * Sets a name localization for this command.
	 *
	 * @param locale - The locale to set
	 * @param localizedName - The localized name for the given `locale`
	 */
	public setNameLocalization(locale: LocaleString, localizedName: string | null) {
		if (!this.name_localizations) {
			Reflect.set(this, 'name_localizations', {});
		}

		const parsedLocale = validateLocale(locale);

		if (localizedName === null) {
			this.name_localizations![parsedLocale] = null;
			return this;
		}

		validateName(localizedName);

		this.name_localizations![parsedLocale] = localizedName;
		return this;
	}

	/**
	 * Sets the name localizations for this command.
	 *
	 * @param localizedNames - The object of localized names to set
	 */
	public setNameLocalizations(localizedNames: LocalizationMap | null) {
		if (localizedNames === null) {
			Reflect.set(this, 'name_localizations', null);
			return this;
		}

		Reflect.set(this, 'name_localizations', {});

		for (const args of Object.entries(localizedNames))
			this.setNameLocalization(...(args as [LocaleString, string | null]));
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		validateRequiredParameters(this.name, this.type);

		validateLocalizationMap(this.name_localizations);

		return { ...this };
	}
}

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
	/**
	 * The name of this context menu command
	 */
	public readonly name: string = undefined!;

	/**
	 * The localized names for this command
	 */
	public readonly nameLocalizations?: LocalizationMap;

	/**
	 * The type of this context menu command
	 */
	public readonly type: ContextMenuCommandType = undefined!;

	/**
	 * Whether the command is enabled by default when the app is added to a guild
	 *
	 * @deprecated This property is deprecated and will be removed in the future.
	 * You should use {@link ContextMenuCommandBuilder.setDefaultMemberPermissions} or {@link ContextMenuCommandBuilder.setDMPermission} instead.
	 */
	public readonly default_permission: boolean | undefined = undefined;

	/**
	 * Set of permissions represented as a bit set for the command
	 */
	public readonly default_member_permissions: Permissions | null | undefined = undefined;

	/**
	 * Indicates whether the command is available in DMs with the application, only for globally-scoped commands.
	 * By default, commands are visible.
	 */
	public readonly dm_permission: boolean | undefined = undefined;

	/**
	 * Sets the name
	 *
	 * @param name - The name
	 */
	public setName(name: string) {
		// Assert the name matches the conditions
		validateName(name);

		Reflect.set(this, 'name', name);

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

		Reflect.set(this, 'type', type);

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

		Reflect.set(this, 'defaultPermission', value);

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

		Reflect.set(this, 'defaultMemberPermissions', permissionValue);

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

		Reflect.set(this, 'dmPermission', enabled);

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
		validateRequiredParameters(this.name, this.type);

		validateLocalizationMap(this.nameLocalizations);

		return { ...this };
	}
}

export type ContextMenuCommandType = ApplicationCommandType.Message | ApplicationCommandType.User;

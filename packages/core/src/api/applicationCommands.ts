import { type REST, makeURLSearchParams } from '@discordjs/rest';
import {
	type RESTGetAPIApplicationCommandsResult,
	type RESTPostAPIApplicationCommandsJSONBody,
	type RESTGetAPIApplicationCommandPermissionsResult,
	type RESTGetAPIApplicationCommandResult,
	type RESTGetAPIGuildApplicationCommandsPermissionsResult,
	type RESTPatchAPIApplicationCommandJSONBody,
	type RESTPatchAPIApplicationCommandResult,
	type RESTPostAPIApplicationCommandsResult,
	type RESTPutAPIApplicationCommandPermissionsJSONBody,
	type RESTPutAPIApplicationCommandPermissionsResult,
	type RESTPutAPIApplicationCommandsJSONBody,
	type RESTPutAPIApplicationCommandsResult,
	type Snowflake,
	Routes,
} from 'discord-api-types/v10';

export class ApplicationCommandsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all global commands for a application
	 *
	 * @param applicationId - The application id to fetch commands for
	 * @param options - The options to use when fetching commands
	 */
	public async getGlobalCommands(applicationId: Snowflake, options: { with_localizations?: boolean } = {}) {
		return this.rest.get(Routes.applicationCommands(applicationId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIApplicationCommandsResult>;
	}

	/**
	 * Creates a new global command
	 *
	 * @param applicationId - The application id to create the command for
	 * @param options - The options to use when creating the command
	 */
	public async createGlobalCommand(applicationId: Snowflake, options: RESTPostAPIApplicationCommandsJSONBody) {
		return this.rest.post(Routes.applicationCommands(applicationId), {
			body: options,
		}) as Promise<RESTPostAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches a global command
	 *
	 * @param applicationId - The application id to fetch the command from
	 * @param commandId - The command id to fetch
	 */
	public async getGlobalCommand(applicationId: Snowflake, commandId: Snowflake) {
		return this.rest.get(
			Routes.applicationCommand(applicationId, commandId),
		) as Promise<RESTGetAPIApplicationCommandResult>;
	}

	/**
	 * Edits a global command
	 *
	 * @param applicationId - The application id of the command
	 * @param commandId - The id of the command to edit
	 * @param options - The options to use when editing the command
	 */
	public async editGlobalCommand(
		applicationId: Snowflake,
		commandId: Snowflake,
		options: RESTPatchAPIApplicationCommandJSONBody,
	) {
		return this.rest.patch(Routes.applicationCommand(applicationId, commandId), {
			body: options,
		}) as Promise<RESTPatchAPIApplicationCommandResult>;
	}

	/**
	 * Deletes a global command
	 *
	 * @param applicationId - The application id of the command
	 * @param commandId - The id of the command to delete
	 */
	public async deleteGlobalCommand(applicationId: Snowflake, commandId: Snowflake) {
		await this.rest.delete(Routes.applicationCommand(applicationId, commandId));
	}

	/**
	 * Overwrites global commands
	 *
	 * @param applicationId - The application id to overwrite commands for
	 * @param options - The options to use when overwriting commands
	 */
	public async bulkOverwriteGlobalCommands(applicationId: Snowflake, options: RESTPutAPIApplicationCommandsJSONBody) {
		return this.rest.put(Routes.applicationCommands(applicationId), {
			body: options,
		}) as Promise<RESTPutAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches all commands for a guild
	 *
	 * @param applicationId - The application id to fetch commands for
	 * @param guildId - The guild id to fetch commands for
	 * @param options - The options to use when fetching commands
	 */
	public async getGuildCommands(
		applicationId: Snowflake,
		guildId: Snowflake,
		options: { with_localizations?: boolean } = {},
	) {
		return this.rest.get(Routes.applicationGuildCommands(applicationId, guildId), {
			query: makeURLSearchParams(options),
		}) as Promise<RESTGetAPIApplicationCommandsResult>;
	}

	/**
	 * Creates a new command for a guild
	 *
	 * @param applicationId - The application id to create the command for
	 * @param guildId - The guild id to create the command for
	 * @param options - The options to use when creating the command
	 */
	public async createGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		options: RESTPostAPIApplicationCommandsJSONBody,
	) {
		return this.rest.post(Routes.applicationGuildCommands(applicationId, guildId), {
			body: options,
		}) as Promise<RESTPostAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches a guild command
	 *
	 * @param applicationId - The application id to fetch the command from
	 * @param guildId - The guild id to fetch the command from
	 * @param commandId - The command id to fetch
	 */
	public async getGuildCommand(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake) {
		return this.rest.get(
			Routes.applicationGuildCommand(applicationId, guildId, commandId),
		) as Promise<RESTGetAPIApplicationCommandResult>;
	}

	/**
	 * Edits a guild command
	 *
	 * @param applicationID - The application id of the command
	 * @param guildID - The guild id of the command
	 * @param commandID - The command id to edit
	 * @param options - The options to use when editing the command
	 */
	public async editGuildCommand(
		applicationID: Snowflake,
		guildID: Snowflake,
		commandID: Snowflake,
		options: RESTPatchAPIApplicationCommandJSONBody,
	) {
		return this.rest.patch(Routes.applicationGuildCommand(applicationID, guildID, commandID), {
			body: options,
		}) as Promise<RESTPatchAPIApplicationCommandResult>;
	}

	/**
	 * Deletes a guild command
	 *
	 * @param applicationID - The application id of the command
	 * @param guildID - The guild id of the command
	 * @param commandID - The id of the command to delete
	 */
	public async deleteGuildCommand(applicationID: Snowflake, guildID: Snowflake, commandID: Snowflake) {
		await this.rest.delete(Routes.applicationGuildCommand(applicationID, guildID, commandID));
	}

	/**
	 * Bulk overwrites guild commands
	 *
	 * @param applicationId - The application id to overwrite commands for
	 * @param guildId - The guild id to overwrite commands for
	 * @param options - The options to use when overwriting commands
	 */
	public async bulkOverwriteGuildCommands(
		applicationId: Snowflake,
		guildId: Snowflake,
		options: RESTPutAPIApplicationCommandsJSONBody,
	) {
		return this.rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
			body: options,
		}) as Promise<RESTPutAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches the permissions for a guild command
	 *
	 * @param applicationId - The application id to get the permissions for
	 * @param guildId - The guild id of the command
	 * @param commandId - The command id to get the permissions for
	 */
	public async getGuildCommandPermissions(applicationId: Snowflake, guildId: Snowflake, commandId: Snowflake) {
		return this.rest.get(
			Routes.applicationCommandPermissions(applicationId, guildId, commandId),
		) as Promise<RESTGetAPIApplicationCommandPermissionsResult>;
	}

	/**
	 * Fetches all permissions for all commands in a guild
	 *
	 * @param applicationId - The application id to get the permissions for
	 * @param guildId - The guild id to get the permissions for
	 */
	public async getGuildCommandsPermissions(applicationId: Snowflake, guildId: Snowflake) {
		return this.rest.get(
			Routes.guildApplicationCommandsPermissions(applicationId, guildId),
		) as Promise<RESTGetAPIGuildApplicationCommandsPermissionsResult>;
	}

	/**
	 * Edits the permissions for a guild command
	 *
	 * @param applicationId - The application id to edit the permissions for
	 * @param guildId - The guild id to edit the permissions for
	 * @param commandId - The id of the command to edit the permissions for
	 * @param options - The options to use when editing the permissions
	 */
	public async editGuildCommandPermissions(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		options: RESTPutAPIApplicationCommandPermissionsJSONBody,
	) {
		return this.rest.put(Routes.applicationCommandPermissions(applicationId, guildId, commandId), {
			body: options,
		}) as Promise<RESTPutAPIApplicationCommandPermissionsResult>;
	}
}

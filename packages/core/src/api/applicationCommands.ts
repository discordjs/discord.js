import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIApplicationCommandPermissionsResult,
	type RESTGetAPIApplicationCommandResult,
	type RESTGetAPIApplicationCommandsResult,
	type RESTGetAPIGuildApplicationCommandsPermissionsResult,
	type RESTPatchAPIApplicationCommandJSONBody,
	type RESTPatchAPIApplicationCommandResult,
	type RESTPostAPIApplicationCommandsJSONBody,
	type RESTPostAPIApplicationCommandsResult,
	type RESTPutAPIApplicationCommandPermissionsJSONBody,
	type RESTPutAPIApplicationCommandPermissionsResult,
	type RESTPutAPIApplicationCommandsJSONBody,
	type RESTGetAPIApplicationCommandsQuery,
	type RESTPutAPIApplicationCommandsResult,
	type RESTGetAPIApplicationGuildCommandsQuery,
	type Snowflake,
} from 'discord-api-types/v10';

export class ApplicationCommandsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all global commands for a application
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands}
	 * @param applicationId - The application id to fetch commands for
	 * @param query - The query options to use when fetching commands
	 * @param options - The options to use when fetching commands
	 */
	public async getGlobalCommands(
		applicationId: Snowflake,
		query: RESTGetAPIApplicationCommandsQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationCommands(applicationId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIApplicationCommandsResult>;
	}

	/**
	 * Creates a new global command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-global-application-command}
	 * @param applicationId - The application id to create the command for
	 * @param body - The data to use when creating the command
	 * @param options - The options to use when creating the command
	 */
	public async createGlobalCommand(
		applicationId: Snowflake,
		body: RESTPostAPIApplicationCommandsJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.applicationCommands(applicationId), {
			body,
			signal,
		}) as Promise<RESTPostAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches a global command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-global-application-command}
	 * @param applicationId - The application id to fetch the command from
	 * @param commandId - The command id to fetch
	 * @param options - The options to use when fetching the command
	 */
	public async getGlobalCommand(
		applicationId: Snowflake,
		commandId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.get(Routes.applicationCommand(applicationId, commandId), {
			signal,
		}) as Promise<RESTGetAPIApplicationCommandResult>;
	}

	/**
	 * Edits a global command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command}
	 * @param applicationId - The application id of the command
	 * @param commandId - The id of the command to edit
	 * @param body - The data to use when editing the command
	 * @param options - The options for editing the command
	 */
	public async editGlobalCommand(
		applicationId: Snowflake,
		commandId: Snowflake,
		body: RESTPatchAPIApplicationCommandJSONBody,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.patch(Routes.applicationCommand(applicationId, commandId), {
			body,
			signal,
		}) as Promise<RESTPatchAPIApplicationCommandResult>;
	}

	/**
	 * Deletes a global command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command}
	 * @param applicationId - The application id of the command
	 * @param commandId - The id of the command to delete
	 * @param options - The options for deleting a command
	 */
	public async deleteGlobalCommand(
		applicationId: Snowflake,
		commandId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		await this.rest.delete(Routes.applicationCommand(applicationId, commandId), { signal });
	}

	/**
	 * Overwrites global commands
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands}
	 * @param applicationId - The application id to overwrite commands for
	 * @param body - The data to use when overwriting commands
	 * @param options - The options for overwriting commands
	 */
	public async bulkOverwriteGlobalCommands(
		applicationId: Snowflake,
		body: RESTPutAPIApplicationCommandsJSONBody,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.put(Routes.applicationCommands(applicationId), {
			body,
			signal,
		}) as Promise<RESTPutAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches all commands for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands}
	 * @param applicationId - The application id to fetch commands for
	 * @param guildId - The guild id to fetch commands for
	 * @param query - The data to use when fetching commands
	 * @param options - The options to use when fetching commands
	 */
	public async getGuildCommands(
		applicationId: Snowflake,
		guildId: Snowflake,
		query: RESTGetAPIApplicationGuildCommandsQuery = {},
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationGuildCommands(applicationId, guildId), {
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIApplicationCommandsResult>;
	}

	/**
	 * Creates a new command for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command}
	 * @param applicationId - The application id to create the command for
	 * @param guildId - The guild id to create the command for
	 * @param body - The data to use when creating the command
	 * @param options - The options to use when creating the command
	 */
	public async createGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		body: RESTPostAPIApplicationCommandsJSONBody,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.post(Routes.applicationGuildCommands(applicationId, guildId), {
			body,
			signal,
		}) as Promise<RESTPostAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command}
	 * @param applicationId - The application id to fetch the command from
	 * @param guildId - The guild id to fetch the command from
	 * @param commandId - The command id to fetch
	 * @param options - The options to use when fetching the command
	 */
	public async getGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.get(Routes.applicationGuildCommand(applicationId, guildId, commandId), {
			signal,
		}) as Promise<RESTGetAPIApplicationCommandResult>;
	}

	/**
	 * Edits a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command}
	 * @param applicationId - The application id of the command
	 * @param guildId - The guild id of the command
	 * @param commandId - The command id to edit
	 * @param body - The data to use when editing the command
	 * @param options - The options to use when editing the command
	 */
	public async editGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		body: RESTPatchAPIApplicationCommandJSONBody,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.patch(Routes.applicationGuildCommand(applicationId, guildId, commandId), {
			body,
			signal,
		}) as Promise<RESTPatchAPIApplicationCommandResult>;
	}

	/**
	 * Deletes a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command}
	 * @param applicationId - The application id of the command
	 * @param guildId - The guild id of the command
	 * @param commandId - The id of the command to delete
	 * @param options - The options for deleting the command
	 */
	public async deleteGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		await this.rest.delete(Routes.applicationGuildCommand(applicationId, guildId, commandId), { signal });
	}

	/**
	 * Bulk overwrites guild commands
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands}
	 * @param applicationId - The application id to overwrite commands for
	 * @param guildId - The guild id to overwrite commands for
	 * @param body - The data to use when overwriting commands
	 * @param options - The options to use when overwriting the commands
	 */
	public async bulkOverwriteGuildCommands(
		applicationId: Snowflake,
		guildId: Snowflake,
		body: RESTPutAPIApplicationCommandsJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
			body,
			signal,
		}) as Promise<RESTPutAPIApplicationCommandsResult>;
	}

	/**
	 * Fetches the permissions for a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions}
	 * @param applicationId - The application id to get the permissions for
	 * @param guildId - The guild id of the command
	 * @param commandId - The command id to get the permissions for
	 * @param options - The option for fetching the command
	 */
	public async getGuildCommandPermissions(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationCommandPermissions(applicationId, guildId, commandId), {
			signal,
		}) as Promise<RESTGetAPIApplicationCommandPermissionsResult>;
	}

	/**
	 * Fetches all permissions for all commands in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions}
	 * @param applicationId - The application id to get the permissions for
	 * @param guildId - The guild id to get the permissions for
	 * @param options - The options for fetching permissions
	 */
	public async getGuildCommandsPermissions(
		applicationId: Snowflake,
		guildId: Snowflake,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.get(Routes.guildApplicationCommandsPermissions(applicationId, guildId), {
			signal,
		}) as Promise<RESTGetAPIGuildApplicationCommandsPermissionsResult>;
	}

	/**
	 * Edits the permissions for a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions}
	 * @param userToken - The token of the user to edit permissions on behalf of
	 * @param applicationId - The application id to edit the permissions for
	 * @param guildId - The guild id to edit the permissions for
	 * @param commandId - The id of the command to edit the permissions for
	 * @param body - The data to use when editing the permissions
	 * @param options - The options to use when editing the permissions
	 */
	public async editGuildCommandPermissions(
		userToken: string,
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		body: RESTPutAPIApplicationCommandPermissionsJSONBody,
		{ signal }: Pick<RequestData, 'signal'>,
	) {
		return this.rest.put(Routes.applicationCommandPermissions(applicationId, guildId, commandId), {
			headers: { Authorization: `Bearer ${userToken.replace('Bearer ', '')}` },
			auth: false,
			body,
			signal,
		}) as Promise<RESTPutAPIApplicationCommandPermissionsResult>;
	}
}

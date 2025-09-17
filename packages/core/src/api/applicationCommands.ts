/* eslint-disable jsdoc/check-param-names */

import { makeURLSearchParams, type RequestData, type REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIApplicationCommandPermissionsResult,
	type RESTGetAPIApplicationCommandResult,
	type RESTGetAPIApplicationCommandsQuery,
	type RESTGetAPIApplicationCommandsResult,
	type RESTGetAPIApplicationGuildCommandResult,
	type RESTGetAPIApplicationGuildCommandsQuery,
	type RESTGetAPIApplicationGuildCommandsResult,
	type RESTGetAPIGuildApplicationCommandsPermissionsResult,
	type RESTPatchAPIApplicationCommandJSONBody,
	type RESTPatchAPIApplicationCommandResult,
	type RESTPatchAPIApplicationGuildCommandJSONBody,
	type RESTPatchAPIApplicationGuildCommandResult,
	type RESTPostAPIApplicationCommandsJSONBody,
	type RESTPostAPIApplicationCommandsResult,
	type RESTPostAPIApplicationGuildCommandsJSONBody,
	type RESTPostAPIApplicationGuildCommandsResult,
	type RESTPutAPIApplicationCommandPermissionsJSONBody,
	type RESTPutAPIApplicationCommandPermissionsResult,
	type RESTPutAPIApplicationCommandsJSONBody,
	type RESTPutAPIApplicationCommandsResult,
	type RESTPutAPIApplicationGuildCommandsJSONBody,
	type RESTPutAPIApplicationGuildCommandsResult,
	type Snowflake,
} from 'discord-api-types/v10';
import type { APIOptions } from '../util/api-options.js';

export class ApplicationCommandsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all global commands for a application
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands}
	 * @param options - The options for fetching commands
	 */
	public async getGlobalCommands({
		query,
		route: { applicationId },
		options,
	}: APIOptions<
		Pick<RequestData, 'auth' | 'signal'>,
		{ applicationId: Snowflake },
		never,
		RESTGetAPIApplicationCommandsQuery
	>) {
		return this.rest.get(Routes.applicationCommands(applicationId), {
			...options,
			query: makeURLSearchParams(query),
		}) as Promise<RESTGetAPIApplicationCommandsResult>;
	}

	/**
	 * Creates a new global command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-global-application-command}
	 * @param applicationId - The application id to create the command for
	 * @param body - The data for creating the command
	 * @param options - The options for creating the command
	 */
	public async createGlobalCommand(
		applicationId: Snowflake,
		body: RESTPostAPIApplicationCommandsJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.post(Routes.applicationCommands(applicationId), {
			auth,
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
	 * @param options - The options for fetching the command
	 */
	public async getGlobalCommand(
		applicationId: Snowflake,
		commandId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationCommand(applicationId, commandId), {
			auth,
			signal,
		}) as Promise<RESTGetAPIApplicationCommandResult>;
	}

	/**
	 * Edits a global command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command}
	 * @param applicationId - The application id of the command
	 * @param commandId - The id of the command to edit
	 * @param body - The data for editing the command
	 * @param options - The options for editing the command
	 */
	public async editGlobalCommand(
		applicationId: Snowflake,
		commandId: Snowflake,
		body: RESTPatchAPIApplicationCommandJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.applicationCommand(applicationId, commandId), {
			auth,
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
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.applicationCommand(applicationId, commandId), { auth, signal });
	}

	/**
	 * Overwrites global commands
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands}
	 * @param applicationId - The application id to overwrite commands for
	 * @param body - The data for overwriting commands
	 * @param options - The options for overwriting commands
	 */
	public async bulkOverwriteGlobalCommands(
		applicationId: Snowflake,
		body: RESTPutAPIApplicationCommandsJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.put(Routes.applicationCommands(applicationId), {
			auth,
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
	 * @param query - The data for fetching commands
	 * @param options - The options for fetching commands
	 */
	public async getGuildCommands(
		applicationId: Snowflake,
		guildId: Snowflake,
		query: RESTGetAPIApplicationGuildCommandsQuery = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationGuildCommands(applicationId, guildId), {
			auth,
			query: makeURLSearchParams(query),
			signal,
		}) as Promise<RESTGetAPIApplicationGuildCommandsResult>;
	}

	/**
	 * Creates a new command for a guild
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command}
	 * @param applicationId - The application id to create the command for
	 * @param guildId - The guild id to create the command for
	 * @param body - The data for creating the command
	 * @param options - The options for creating the command
	 */
	public async createGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		body: RESTPostAPIApplicationGuildCommandsJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.post(Routes.applicationGuildCommands(applicationId, guildId), {
			auth,
			body,
			signal,
		}) as Promise<RESTPostAPIApplicationGuildCommandsResult>;
	}

	/**
	 * Fetches a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command}
	 * @param applicationId - The application id to fetch the command from
	 * @param guildId - The guild id to fetch the command from
	 * @param commandId - The command id to fetch
	 * @param options - The options for fetching the command
	 */
	public async getGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationGuildCommand(applicationId, guildId, commandId), {
			auth,
			signal,
		}) as Promise<RESTGetAPIApplicationGuildCommandResult>;
	}

	/**
	 * Edits a guild command
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command}
	 * @param applicationId - The application id of the command
	 * @param guildId - The guild id of the command
	 * @param commandId - The command id to edit
	 * @param body - The data for editing the command
	 * @param options - The options for editing the command
	 */
	public async editGuildCommand(
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		body: RESTPatchAPIApplicationGuildCommandJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.applicationGuildCommand(applicationId, guildId, commandId), {
			auth,
			body,
			signal,
		}) as Promise<RESTPatchAPIApplicationGuildCommandResult>;
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
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		await this.rest.delete(Routes.applicationGuildCommand(applicationId, guildId, commandId), { auth, signal });
	}

	/**
	 * Bulk overwrites guild commands
	 *
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands}
	 * @param applicationId - The application id to overwrite commands for
	 * @param guildId - The guild id to overwrite commands for
	 * @param body - The data for overwriting commands
	 * @param options - The options for overwriting the commands
	 */
	public async bulkOverwriteGuildCommands(
		applicationId: Snowflake,
		guildId: Snowflake,
		body: RESTPutAPIApplicationGuildCommandsJSONBody,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
			auth,
			body,
			signal,
		}) as Promise<RESTPutAPIApplicationGuildCommandsResult>;
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
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.applicationCommandPermissions(applicationId, guildId, commandId), {
			auth,
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
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.guildApplicationCommandsPermissions(applicationId, guildId), {
			auth,
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
	 * @param body - The data for editing the permissions
	 * @param options - The options for editing the permissions
	 */
	public async editGuildCommandPermissions(
		userToken: string,
		applicationId: Snowflake,
		guildId: Snowflake,
		commandId: Snowflake,
		body: RESTPutAPIApplicationCommandPermissionsJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.put(Routes.applicationCommandPermissions(applicationId, guildId, commandId), {
			headers: { Authorization: `Bearer ${userToken.replace('Bearer ', '')}` },
			auth: false,
			body,
			signal,
		}) as Promise<RESTPutAPIApplicationCommandPermissionsResult>;
	}
}

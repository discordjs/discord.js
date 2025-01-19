/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	Routes,
	type Snowflake,
	type RESTGetAPIVoiceRegionsResult,
	type RESTGetAPIGuildVoiceStateUserResult,
	type RESTGetAPIGuildVoiceStateCurrentMemberResult,
	type RESTPatchAPIGuildVoiceStateUserJSONBody,
	type RESTPatchAPIGuildVoiceStateCurrentMemberResult,
	type RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
	type RESTPatchAPIGuildVoiceStateUserResult,
} from 'discord-api-types/v10';

export class VoiceAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all voice regions
	 *
	 * @see {@link https://discord.com/developers/docs/resources/voice#list-voice-regions}
	 * @param options - The options for fetching the voice regions
	 */
	public async getVoiceRegions({ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.voiceRegions(), { auth, signal }) as Promise<RESTGetAPIVoiceRegionsResult>;
	}

	/**
	 * Fetches voice state of a user by their id
	 *
	 * @see {@link https://discord.com/developers/docs/resources/voice#get-user-voice-state}
	 * @param options - The options for fetching user voice state
	 */
	public async getUserVoiceState(
		guildId: Snowflake,
		userId: Snowflake,
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.get(Routes.guildVoiceState(guildId, userId), {
			auth,
			signal,
		}) as Promise<RESTGetAPIGuildVoiceStateUserResult>;
	}

	/**
	 * Fetches the current user's voice state
	 *
	 * @see {@link https://discord.com/developers/docs/resources/voice#get-current-user-voice-state}
	 * @param options - The options for fetching user voice state
	 */
	public async getVoiceState(guildId: Snowflake, { auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.guildVoiceState(guildId, '@me'), {
			auth,
			signal,
		}) as Promise<RESTGetAPIGuildVoiceStateCurrentMemberResult>;
	}

	/**
	 * Edits a user's voice state in a guild
	 *
	 * @see {@link https://discord.com/developers/docs/resources/voice#modify-user-voice-state}
	 * @param guildId - The id of the guild to edit the current user's voice state in
	 * @param userId - The id of the user to edit the voice state for
	 * @param body - The data for editing the voice state
	 * @param options - The options for editing the voice state
	 */
	public async editUserVoiceState(
		guildId: Snowflake,
		userId: Snowflake,
		body: RESTPatchAPIGuildVoiceStateUserJSONBody,
		{ auth, reason, signal }: Pick<RequestData, 'auth' | 'reason' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildVoiceState(guildId, userId), {
			auth,
			reason,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildVoiceStateUserResult>;
	}

	/**
	 * Edits the voice state for the current user
	 *
	 * @see {@link https://discord.com/developers/docs/resources/voice#modify-current-user-voice-state}
	 * @param guildId - The id of the guild
	 * @param body - The data for editing the voice state
	 * @param options - The options for editing the voice state
	 */
	public async editVoiceState(
		guildId: Snowflake,
		body: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody = {},
		{ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {},
	) {
		return this.rest.patch(Routes.guildVoiceState(guildId, '@me'), {
			auth,
			body,
			signal,
		}) as Promise<RESTPatchAPIGuildVoiceStateCurrentMemberResult>;
	}
}

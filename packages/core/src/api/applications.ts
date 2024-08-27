/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIApplicationEmojiResult,
	type RESTGetAPIApplicationEmojisResult,
	type RESTGetCurrentApplicationResult,
	type RESTPatchAPIApplicationEmojiJSONBody,
	type RESTPatchAPIApplicationEmojiResult,
	type RESTPatchCurrentApplicationJSONBody,
	type RESTPatchCurrentApplicationResult,
	type RESTPostAPIApplicationEmojiJSONBody,
	type RESTPostAPIApplicationEmojiResult,
	type Snowflake,
} from 'discord-api-types/v10';

export class ApplicationsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches the application associated with the requesting bot user.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application#get-current-application}
	 * @param options - The options for fetching the application
	 */
	public async getCurrent({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.currentApplication(), { signal }) as Promise<RESTGetCurrentApplicationResult>;
	}

	/**
	 * Edits properties of the application associated with the requesting bot user.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application#edit-current-application}
	 * @param body - The new application data
	 * @param options - The options for editing the application
	 */
	public async editCurrent(body: RESTPatchCurrentApplicationJSONBody, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.patch(Routes.currentApplication(), {
			body,
			signal,
		}) as Promise<RESTPatchCurrentApplicationResult>;
	}

	/**
	 * Fetches all emojis of an application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#list-application-emojis}
	 * @param applicationId - The id of the application to fetch the emojis of
	 * @param options - The options for fetching the emojis
	 */
	public async getEmojis(applicationId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.applicationEmojis(applicationId), {
			signal,
		}) as Promise<RESTGetAPIApplicationEmojisResult>;
	}

	/**
	 * Fetches an emoji of an application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#get-application-emoji}
	 * @param applicationId - The id of the application to fetch the emoji of
	 * @param emojiId - The id of the emoji to fetch
	 * @param options - The options for fetching the emoji
	 */
	public async getEmoji(applicationId: Snowflake, emojiId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.applicationEmoji(applicationId, emojiId), {
			signal,
		}) as Promise<RESTGetAPIApplicationEmojiResult>;
	}

	/**
	 * Creates a new emoji of an application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#create-application-emoji}
	 * @param applicationId - The id of the application to create the emoji of
	 * @param body - The data for creating the emoji
	 * @param options - The options for creating the emoji
	 */
	public async createEmoji(
		applicationId: Snowflake,
		body: RESTPostAPIApplicationEmojiJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.applicationEmojis(applicationId), {
			body,
			signal,
		}) as Promise<RESTPostAPIApplicationEmojiResult>;
	}

	/**
	 * Edits an emoji of an application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#modify-application-emoji}
	 * @param applicationId - The id of the application to edit the emoji of
	 * @param emojiId - The id of the emoji to edit
	 * @param body - The data for editing the emoji
	 * @param options - The options for editing the emoji
	 */
	public async editEmoji(
		applicationId: Snowflake,
		emojiId: Snowflake,
		body: RESTPatchAPIApplicationEmojiJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.patch(Routes.applicationEmoji(applicationId, emojiId), {
			body,
			signal,
		}) as Promise<RESTPatchAPIApplicationEmojiResult>;
	}

	/**
	 * Deletes an emoji of an application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/emoji#delete-application-emoji}
	 * @param applicationId - The id of the application to delete the emoji of
	 * @param emojiId - The id of the emoji to delete
	 * @param options - The options for deleting the emoji
	 */
	public async deleteEmoji(applicationId: Snowflake, emojiId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		await this.rest.delete(Routes.applicationEmoji(applicationId, emojiId), { signal });
	}
}

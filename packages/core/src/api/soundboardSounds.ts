/* eslint-disable jsdoc/check-param-names */

import type { REST } from '@discordjs/rest';
import { Routes, type RESTGetAPISoundboardDefaultSoundsResult } from 'discord-api-types/v10';
import type { RequestOptions } from '../util/types.js';

export class SoundboardSoundsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all the soundboard default sounds.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#list-default-soundboard-sounds}
	 * @param options - The options for fetching the soundboard default sounds.
	 */
	public async getSoundboardDefaultSounds({
		auth,
		dispatcher,
		headers,
		rejectOnRateLimit,
		signal,
	}: RequestOptions = {}) {
		return this.rest.get(Routes.soundboardDefaultSounds(), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPISoundboardDefaultSoundsResult>;
	}
}

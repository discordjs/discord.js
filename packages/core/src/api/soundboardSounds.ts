/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import { Routes, type RESTGetAPISoundboardDefaultSoundsResult } from 'discord-api-types/v10';

export class SoundboardSoundsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all the soundboard default sounds.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/soundboard#list-default-soundboard-sounds}
	 * @param options - The options for fetching the soundboard default sounds.
	 */
	public async getSoundboardDefaultSounds({ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.soundboardDefaultSounds(), {
			auth,
			signal,
		}) as Promise<RESTGetAPISoundboardDefaultSoundsResult>;
	}
}

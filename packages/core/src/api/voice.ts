/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import { Routes, type RESTGetAPIVoiceRegionsResult } from 'discord-api-types/v10';

export class VoiceAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Fetches all voice regions
	 *
	 * @see {@link https://discord.com/developers/docs/resources/voice#list-voice-regions}
	 * @param options - The options to use when fetching the voice regions
	 */
	public async getVoiceRegions({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.voiceRegions(), { signal }) as Promise<RESTGetAPIVoiceRegionsResult>;
	}
}

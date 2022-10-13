import type { REST } from '@discordjs/rest';
import { Routes, type APIVoiceRegion } from 'discord-api-types/v10';

export class VoiceAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Fetches all voice regions
	 */
	public async getVoiceRegions() {
		return (await this.rest.get(Routes.voiceRegions())) as APIVoiceRegion[];
	}
}

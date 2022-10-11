import type { REST } from '@discordjs/rest';
import { Routes, type APIVoiceRegion } from 'discord-api-types/v10';

export const voice = (api: REST) => ({
	async getVoiceRegions() {
		return (await api.get(Routes.voiceRegions())) as APIVoiceRegion[];
	},
});

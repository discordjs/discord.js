import { Events } from 'discord.js';
import type { Event } from './index.js';

const name = Events.ClientReady as const;

export const data: Event<typeof name> = {
	name,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

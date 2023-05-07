import { Events } from 'discord.js';
import type { Event } from './index.js';

const name = Events.ClientReady as const;

export default {
	name,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
} satisfies Event<typeof name>;

import { Events } from 'npm:discord.js@^14.13.0';
import type { Event } from './index.ts';

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
} satisfies Event<Events.ClientReady>;

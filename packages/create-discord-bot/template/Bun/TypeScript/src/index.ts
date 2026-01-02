import { Client, GatewayIntentBits } from 'discord.js';
import { loadEvents } from './util/loaders.ts';

const token = Bun.env.DISCORD_TOKEN;

if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

// Initialize the client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load the events and commands
const events = await loadEvents(new URL('events/', import.meta.url));

// Register the event handlers
for (const event of events) {
	client[event.once ? 'once' : 'on'](event.name, async (...args) => {
		try {
			await event.execute(...args);
		} catch (error) {
			console.error(`Error executing event ${String(event.name)}:`, error);
		}
	});
}

// Login to the client
try {
	await client.login(token);
} catch (error) {
	console.error('Failed to login:', error);
	process.exitCode = 1;
}

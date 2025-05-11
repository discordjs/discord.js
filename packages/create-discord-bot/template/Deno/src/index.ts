import 'https://deno.land/std@0.223.0/dotenv/load.ts';
import { URL } from 'node:url';
import { Client, GatewayIntentBits } from 'npm:discord.js@^14.19.3';
import { loadEvents } from './util/loaders.ts';

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
void client.login(Deno.env.get('DISCORD_TOKEN'));

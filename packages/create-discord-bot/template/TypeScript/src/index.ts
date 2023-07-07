import { readdir } from 'node:fs/promises';
import { URL } from 'node:url';
import { Client, GatewayIntentBits } from 'discord.js';
import type { Event } from './events/index.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const eventsPath = new URL('events/', import.meta.url);

const eventFiles = await readdir(eventsPath).then((files) =>
	files.filter((file) => file.endsWith('.js') && file !== 'index.js'),
);

for (const file of eventFiles) {
	const event: Event = (await import(new URL(file, eventsPath).toString())).default;
	client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
}

void client.login();

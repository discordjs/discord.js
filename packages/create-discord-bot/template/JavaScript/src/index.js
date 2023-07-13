import { readdir } from 'node:fs/promises';
import { URL } from 'node:url';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const eventsPath = new URL('events/', import.meta.url);
const eventFiles = await readdir(eventsPath).then((files) => files.filter((file) => file.endsWith('.js')));

for (const file of eventFiles) {
	const event = (await import(new URL(file, eventsPath).toString())).default;
	client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
}

void client.login();

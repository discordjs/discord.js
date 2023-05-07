import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const eventsPath = fileURLToPath(new URL('events', import.meta.url));
const eventFiles = await readdir(eventsPath).then((files) => files.filter((file) => file.endsWith('.js')));

for (const file of eventFiles) {
	const event = (await import(join(eventsPath, file))).default;
	client[event.data.once ? 'once' : 'on'](event.data.name, async (...args) => event.data.execute(...args));
}

void client.login();

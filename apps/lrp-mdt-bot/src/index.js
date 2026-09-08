import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { getConfig, requireEnvironment, rootDirectory } from './config.js';
import { createInteractionHandler } from './router.js';
import { MdtStore } from './store.js';

const config = getConfig();
requireEnvironment(config, ['token']);

const seed = JSON.parse(await readFile(path.join(rootDirectory, 'data', 'seed.json'), 'utf8'));
const store = await new MdtStore(config.dataFile, seed).init();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`LRP MDT متصل باسم ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, createInteractionHandler({ store, roleIds: config.roleIds }));

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.once(signal, () => {
		client.destroy();
		process.exitCode = 0;
	});
}

await client.login(config.token);

import { API } from '@discordjs/core/http-only';
import { REST } from 'discord.js';
import { loadCommands } from './loaders.ts';

const token = Bun.env.DISCORD_TOKEN;
const applicationId = Bun.env.APPLICATION_ID;

if (!token) {
	throw new Error('The DISCORD_TOKEN environment variable is required.');
}

if (!applicationId) {
	throw new Error('The APPLICATION_ID environment variable is required.');
}

try {
	const commands = await loadCommands(new URL('../commands/', import.meta.url));
	const commandData = [...commands.values()].map((command) => command.data);

	const rest = new REST({ version: '10' }).setToken(token);
	const api = new API(rest);

	const result = await api.applicationCommands.bulkOverwriteGlobalCommands(applicationId, commandData);

	console.log(`Successfully registered ${result.length} commands.`);
} catch (error) {
	console.error('Failed to deploy commands:', error);
	process.exitCode = 1;
}

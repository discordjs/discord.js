import { API } from '@discordjs/core/http-only';
import { REST } from 'discord.js';
import { loadCommands } from './loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));
const commandData = [...commands.values()].map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(Bun.env.DISCORD_TOKEN);
const api = new API(rest);

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(Bun.env.APPLICATION_ID, commandData);

console.log(`Successfully registered ${result.length} commands.`);

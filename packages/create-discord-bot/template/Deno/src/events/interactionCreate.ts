import { Events } from 'npm:discord.js@^14.19.3';
import type { Event } from './index.ts';
import { loadCommands } from '../util/loaders.ts';

const commands = await loadCommands(new URL('../commands/', import.meta.url));

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);

			if (!command) {
				throw new Error(`Command '${interaction.commandName}' not found.`);
			}

			await command.execute(interaction);
		}
	},
} satisfies Event<Events.InteractionCreate>;

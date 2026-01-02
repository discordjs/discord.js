import { Events } from 'discord.js';
import { loadCommands } from '../util/loaders.ts';
import type { Event } from './index.ts';

const commands = await loadCommands(new URL('../commands/', import.meta.url));

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = commands.get(interaction.commandName);

			if (!command) {
				console.warn(`Command '${interaction.commandName}' not found.`);
				await interaction.reply({ content: 'Unknown command.', ephemeral: true });
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing command '${interaction.commandName}':`, error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
				}
			}
		}
	},
} satisfies Event<Events.InteractionCreate>;

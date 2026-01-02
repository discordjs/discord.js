import { Events } from 'discord.js';
import { loadCommands } from '../util/loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));

/** @type {import('../events/index.js').Event<Events.InteractionCreate>} */
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
				try {
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
					} else {
						await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
					}
				} catch {
					// Failed to send error response, interaction may have timed out
				}
			}
		}
	},
};

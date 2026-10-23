import { Events } from 'discord.js';
import { loadCommands } from '../util/loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));

/** @type {import('../events/index.js').Event<Events.InteractionCreate>} */
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
};

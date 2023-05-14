import type { Client } from 'discord.js';
import type { Command } from '../commands/index.js';
import type { Event } from '../events/index.js';

export function registerEvents(commands: Map<string, Command>, events: Event[], client: Client): void {
	for (const event of events) {
		client[event.once ? 'once' : 'on'](event.name, async (...args) => event.execute(...args));
	}

	client.on('interactionCreate', async (interaction) => {
		if (interaction.isCommand()) {
			const command = commands.get(interaction.commandName);

			if (!command) {
				throw new Error(`Command '${interaction.commandName}' not found.`);
			}

			await command.execute(interaction);
		}
	});
}

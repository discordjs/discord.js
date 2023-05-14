/**
 * @param {Map<string, import('../commands/index.js').Command>} commands
 * @param {import('../events/index.js').Event[]} events
 * @param {import('discord.js').Client} client
 */
export function registerEvents(commands, events, client) {
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

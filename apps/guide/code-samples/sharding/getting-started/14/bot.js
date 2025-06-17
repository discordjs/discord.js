// bot.js
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'stats') {
		return interaction.reply(`Server count: ${client.guilds.cache.size}.`);
	}
});

client.login('your-token-goes-here');

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react') {
		const response = await interaction.reply({ content: 'You can react with Unicode emojis!', withResponse: true });
		const { message } = response.resource;
		message.react('😄');
	} else if (commandName === 'react-custom') {
		const response = await interaction.reply({ content: 'You can react with custom emojis!', withResponse: true });
		const { message } = response.resource;
		message.react('123456789012345678');
	} else if (commandName === 'fruits') {
		const response = await interaction.reply({ content: 'Reacting with fruits!', withResponse: true });
		const { message } = response.resource;

		message
			.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
});

client.login('your-token-goes-here');

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'react-await') {
		const response = await interaction.reply({ content: 'Awaiting emojis...', withResponse: true });
		const { message } = response.resource;
		message.react('👍').then(() => message.react('👎'));

		const collectorFilter = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
		};

		message
			.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
			.then((collected) => {
				const reaction = collected.first();

				if (reaction.emoji.name === '👍') {
					interaction.followUp('You reacted with a thumbs up.');
				} else {
					interaction.followUp('You reacted with a thumbs down.');
				}
			})
			.catch((collected) => {
				console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
				interaction.followUp("You didn't react with neither a thumbs up, nor a thumbs down.");
			});
	}
});

client.login('your-token-goes-here');

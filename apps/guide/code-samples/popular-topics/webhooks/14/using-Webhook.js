const { Client, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const embed = new EmbedBuilder().setTitle('Some Title').setColor(0x00ffff);

client.once(Events.ClientReady, async () => {
	const channel = client.channels.cache.get('222197033908436994');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find((wh) => wh.token);

		if (!webhook) {
			return console.log('No webhook was found that I can use!');
		}

		await webhook.send({
			content: 'Webhook test',
			username: 'some-username',
			avatarURL: 'https://i.imgur.com/AfFp7pu.png',
			embeds: [embed],
		});
	} catch (error) {
		console.error('Error trying to send: ', error);
	}
});

client.login(token);

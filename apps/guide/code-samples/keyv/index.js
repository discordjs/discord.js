const { Keyv } = require('keyv');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { globalPrefix, token } = require('./config.json');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
const prefixes = new Keyv('sqlite://path/to.sqlite');

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	let args;
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		} else {
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		if (!prefix) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);
	} else {
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	const command = args.shift().toLowerCase();

	if (command === 'prefix') {
		if (args.length) {
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
		}

		return message.channel.send(`Prefix is \`${(await prefixes.get(message.guild.id)) || globalPrefix}\``);
	}
});

client.login(token);

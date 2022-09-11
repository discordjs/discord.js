export const PACKAGES = ['builders', 'collection', 'proxy', 'rest', 'voice', 'ws'];

export const DESCRIPTION =
	"discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.";

export const CODE_EXAMPLE = `import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
	console.log(\`Logged in as \${client.user.tag}!\`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

await client.login('token');`;

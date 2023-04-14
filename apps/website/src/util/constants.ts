export const PACKAGES = [
	'brokers',
	'builders',
	'collection',
	'core',
	'formatters',
	'next',
	'proxy',
	'rest',
	'util',
	'voice',
	'ws',
];

export const N_RECENT_VERSIONS = 2;

export const OVERLOAD_SEPARATOR = ':';

export const METHOD_SEPARATOR = '#';

export const DESCRIPTION =
	"discord.js is a powerful Node.js module that allows you to interact with the Discord API very easily. It takes a much more object-oriented approach than most other JS Discord libraries, making your bot's code significantly tidier and easier to comprehend.";

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

await client.login(TOKEN);`;

export const DISCORD_API_TYPES_VERSION = 'v10';
export const DISCORD_API_TYPES_DOCS_URL = `https://discord-api-types.dev/api/discord-api-types-${DISCORD_API_TYPES_VERSION}`;

import Discord, { Events, Interaction } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { deploy } from './deploy';
import { interactionHandlers } from './interactions';
import { GatewayIntentBits } from 'discord-api-types/v9';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { token } = require('../auth.json');

const client = new Discord.Client({
	intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
});

client.on(Events.ClientReady, () => console.log('Ready!'));

client.on(Events.MessageCreate, async (message) => {
	if (!message.guild) return;
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner?.id) {
		await deploy(message.guild);
		await message.reply('Deployed!');
	}
});

/**
 * The IDs of the users that can be recorded by the bot.
 */
const recordable = new Set<string>();

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isCommand() || !interaction.guildId) return;

	const handler = interactionHandlers.get(interaction.commandName);

	try {
		if (handler) {
			await handler(interaction, recordable, client, getVoiceConnection(interaction.guildId));
		} else {
			await interaction.reply('Unknown command');
		}
	} catch (error) {
		console.warn(error);
	}
});

client.on(Events.Error, console.warn);

void client.login(token);

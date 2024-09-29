import type { Command } from './index.[REPLACE_IMPORT_EXT]';

export default {
	data: {
		name: 'ping',
		description: 'Ping!',
	},
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
} satisfies Command;

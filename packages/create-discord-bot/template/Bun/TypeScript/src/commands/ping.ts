import type { Command } from './index.ts';

export default {
	data: {
		name: 'ping',
		description: 'Ping!',
	},
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
} satisfies Command;

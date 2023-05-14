/** @type {import('./index.js').Command} */
export default {
	data: {
		name: 'ping',
		description: 'Ping!',
	},
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

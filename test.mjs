import { Client, Events } from './packages/discord.js/src/index.js';

const client = new Client({
	intents: 1,
});

client.on(Events.ClientReady, async () => {
	const guild = client.guilds.cache.get('505181778718228480');

	const onboarding = await guild.fetchOnboarding();

	console.log(onboarding.prompts.first().options.first().emoji);

	// await guild.editOnboarding({
	// 	prompts: [
	// 		{
	// 			title: 'this is a title',
	// 			options: [
	// 				{
	// 					...onboarding.prompts.first().options.first(),
	// 					emoji: '812030610288803851',
	// 				},
	// 			],
	// 		},
	// 	],
	// });
});

await client.login();

import { program } from 'commander';
import prompts from 'prompts';
import { createDiscordBot } from './create-discord-bot.js';

program
	.description('Create a basic discord.js bot.')
	.option('--directory', 'The directory where this will be created.')
	.option('--typescript', 'Whether to use the TypeScript template.')
	.option('--javascript', 'Whether to use the JavaScript template.')
	.parse();

let { typescript, javascript, directory } = program.opts();

if (!directory) {
	directory = (
		await prompts({
			type: 'text',
			name: 'directory',
			initial: 'my-bot',
			message: 'What is the name of the directory you want to create this project in?',
		})
	).directory;
}

if (typescript === undefined && javascript === undefined) {
	const { useTypescript } = await prompts({
		type: 'toggle',
		name: 'useTypescript',
		message: 'Do you want to use TypeScript?',
		initial: true,
		active: 'Yes',
		inactive: 'No',
	});

	typescript = useTypescript;
	javascript = !useTypescript;
}

await createDiscordBot({ typescript, javascript, directory });
